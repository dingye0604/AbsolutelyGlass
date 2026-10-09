// Browser fixture, not live Obsidian. Run from the synchronized vault theme.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const [modules, output, asar, oldBase] = process.argv.slice(2);
const b = fs.readFileSync(asar);
const h = JSON.parse(b.subarray(16, 16 + b.readUInt32LE(12)));
const e = h.files['app.css'];
const offset = 8 + b.readUInt32LE(4) + Number(e.offset);
const appCss = b.subarray(offset, offset + e.size).toString();
const { chromium } = require(path.join(modules, 'playwright'));
const icon = '<div class="clickable-icon"><svg class="svg-icon" width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="3" fill="none" stroke="currentColor"/><path d="M8 3v18" stroke="currentColor"/></svg></div>';
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    async function fixture(css, mode, layout, count, toggleFirst, collapsed, ribbonClass = 'mod-left') {
      const toggle = `<div class="sidebar-toggle-button mod-left mod-primary">${icon}</div>`;
      const actions = `<div class="side-dock-actions">${Array.from({ length: count }, () => `<div class="side-dock-ribbon-action">${icon}</div>`).join('')}</div>`;
      await page.setContent(`<body class="theme-${mode} mod-windows is-frameless show-ribbon css-settings-manager reduce-motion ${layout}"><div class="app-container"><div class="horizontal-main-container"><div class="workspace ${collapsed ? '' : 'is-left-sidedock-open'}"><div class="workspace-ribbon ${ribbonClass} ${collapsed ? 'is-collapsed' : ''}">${toggleFirst ? toggle + actions : actions + toggle}</div><div class="workspace-split mod-root"><div class="workspace-tabs mod-top"><div class="workspace-tab-header-container"><div class="workspace-tab-header-container-inner">Note</div><div class="sidebar-toggle-button mod-right mod-secondary">${icon}</div></div></div></div></div></div></div></body>`);
      await page.addStyleTag({ content: appCss });
      await page.addStyleTag({ content: css });
      await page.addStyleTag({ content: '.app-container{position:fixed;inset:0}.horizontal-main-container,.workspace{width:100%;height:100%}.mod-root{flex:1}' });
      return page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { top: r.top, bottom: r.bottom, height: r.height }; };
        return { toggle: rect('.sidebar-toggle-button.mod-left'), icon: rect('.sidebar-toggle-button.mod-left .clickable-icon'), actions: rect('.side-dock-actions'), right: rect('.sidebar-toggle-button.mod-right'), ribbon: rect('.workspace-ribbon'), ribbonBorder: parseFloat(getComputedStyle(document.querySelector('.workspace-ribbon')).borderTopWidth), position: getComputedStyle(document.querySelector('.sidebar-toggle-button.mod-left')).position };
      });
    }
    if (oldBase) {
      const before = await fixture(fs.readFileSync(oldBase, 'utf8'), 'dark', '', 12, false, true);
      assert(before.toggle.top >= before.actions.bottom, 'Reproduce toggle below ribbon actions');
      await page.screenshot({ path: path.join(output, 'before.png') });
      const primaryBefore = await fixture(fs.readFileSync(oldBase, 'utf8'), 'light', '', 12, true, true, 'mod-primary');
      assert(primaryBefore.icon.top > primaryBefore.ribbon.top + 100, 'Reproduce displaced icon with actual 1.14 primary-only class');
      await page.screenshot({ path: path.join(output, 'before-primary.png') });
    }
    for (const theme of ['AbsolutelyBaseline', 'AbsolutelyGlass']) {
      const css = fs.readFileSync(path.join(__dirname, '..', theme, 'theme.css'), 'utf8');
      for (const mode of ['light', 'dark']) for (const layout of ['', 'layout-classic', 'layout-minimal', 'layout-cards', 'layout-border', 'layout-frame', 'layout-macos', 'layout-fusion']) {
        for (const ribbonClass of ['mod-left', 'mod-primary']) for (const collapsed of [false, true]) for (const toggleFirst of [false, true]) {
          const state = await fixture(css, mode, layout, 12, toggleFirst, collapsed, ribbonClass);
          assert(state.toggle.height > 0 && state.toggle.bottom <= state.actions.top + 1, JSON.stringify({ theme, mode, layout, state }));
          assert(state.icon.top >= state.toggle.top && state.icon.bottom <= state.toggle.bottom, 'Visible icon stays inside top header cell');
          assert.equal(state.position, 'absolute', 'Toggle must be anchored outside action flow');
          assert(Math.abs(state.toggle.top - state.ribbon.top - state.ribbonBorder) < 1, 'Toggle starts at ribbon top: ' + JSON.stringify({ theme, mode, layout, collapsed, state }));
          const topBefore = state.toggle.top;
          await page.evaluate(() => {
            const actions = document.querySelector('.side-dock-actions');
            actions.style.marginTop = '120px';
            for (let i = 0; i < 20; i++) actions.append(actions.firstElementChild.cloneNode(true));
          });
          const topAfter = await page.locator('.sidebar-toggle-button.mod-left').boundingBox();
          assert.equal(topAfter.y, topBefore, 'Actions cannot move the pinned toggle');
          await page.evaluate(() => {
            const actions = document.querySelector('.side-dock-actions');
            actions.style.removeProperty('margin-top');
            while (actions.children.length > 12) actions.lastElementChild.remove();
          });
          assert(state.right.top >= 0 && state.right.top < 100, 'Right toggle stays in header');
          await page.evaluate(() => {
            window.hits = 0;
            document.querySelectorAll('.sidebar-toggle-button').forEach(el => el.onclick = () => window.hits++);
          });
          await page.locator('.sidebar-toggle-button.mod-left .clickable-icon').click({ timeout: 2000 });
          await page.locator('.sidebar-toggle-button.mod-right .clickable-icon').click({ timeout: 2000 });
          assert.equal(await page.evaluate(() => window.hits), 2);
          results.push({ theme, mode, layout, ribbonClass, collapsed, toggleFirst, ...state });
          if (!layout && collapsed && !toggleFirst) await page.screenshot({ path: path.join(output, `${theme}-${mode}-${ribbonClass}.png`) });
        }
      }
    }
    fs.writeFileSync(path.join(output, 'sidebar-toggle.json'), JSON.stringify(results, null, 2));
    console.log(`${results.length} sidebar toggle cases passed across separate legacy and 1.14 ribbon structures.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
