// Browser fixture using installed Obsidian CSS, not live application validation.
// node verify-collapsed-sidebar.cjs <node_modules> <output-dir> <obsidian.asar>
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const [modules, output, asar] = process.argv.slice(2);
const archive = fs.readFileSync(asar);
const header = JSON.parse(archive.subarray(16, 16 + archive.readUInt32LE(12)));
const entry = header.files['app.css'];
const start = 8 + archive.readUInt32LE(4) + Number(entry.offset);
const appCss = archive.subarray(start, start + entry.size).toString();
const { chromium } = require(path.join(modules, 'playwright'));
const svg = '<svg class="svg-icon lucide-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z"/><circle cx="12" cy="12" r="3"/></svg>';
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 720 } });
    for (const theme of ['AbsolutelyBaseline', 'AbsolutelyGlass']) {
      const css = fs.readFileSync(path.join(__dirname, '..', theme, 'theme.css'), 'utf8');
      for (const mode of ['light', 'dark']) {
        for (const layout of ['', 'layout-classic', 'layout-minimal', 'layout-cards', 'layout-border', 'layout-frame', 'layout-macos', 'layout-fusion']) {
          await page.setContent(`<body class="theme-${mode} mod-windows is-frameless show-ribbon css-settings-manager reduce-motion ${layout}"><div class="app-container"><div class="horizontal-main-container"><div class="workspace is-left-sidedock-open"><div class="workspace-ribbon mod-left"><div class="side-dock-actions"><div class="side-dock-ribbon-action">◇</div></div></div><div class="workspace-split mod-left-split mod-sidedock" style="width:240px"><div class="workspace-sidedock-vault-profile"><div class="workspace-drawer-vault-switcher"><div class="workspace-drawer-vault-switcher-icon">⌃</div><div class="workspace-drawer-vault-name">Test vault</div></div><div class="workspace-drawer-vault-actions"><span class="clickable-icon">?</span><span class="clickable-icon" id="settings">${svg}</span></div></div><div class="workspace-tabs">Sidebar content</div></div><div class="workspace-split mod-root">Editor</div></div></div></div></body>`);
          await page.addStyleTag({ content: appCss });
          await page.addStyleTag({ content: css });
          await page.addStyleTag({ content: '.app-container{position:fixed;inset:0}.horizontal-main-container,.workspace{height:100%;width:100%}.mod-root{flex:1}' });
          const original = await page.locator('.workspace-sidedock-vault-profile').boundingBox();
          await page.evaluate(() => {
            window.hits = [];
            document.querySelector('.workspace-drawer-vault-switcher').onclick = () => window.hits.push('vault');
            document.querySelector('#settings').onclick = () => window.hits.push('settings');
            document.querySelector('.workspace').classList.remove('is-left-sidedock-open');
            document.querySelector('.workspace-ribbon').classList.add('is-collapsed');
            const dock = document.querySelector('.mod-left-split');
            dock.classList.add('is-sidedock-collapsed');
            dock.style.cssText = 'display:none;width:0px';
          });
          const state = await page.evaluate(() => {
            const profile = document.querySelector('.workspace-sidedock-vault-profile');
            const vault = document.querySelector('.workspace-drawer-vault-switcher');
            const rect = profile.getBoundingClientRect();
            const vaultRect = vault.getBoundingClientRect();
            const gearRect = document.querySelector('#settings svg').getBoundingClientRect();
            return {
              vaultCenter: vaultRect.x + vaultRect.width / 2,
              gearCenter: gearRect.x + gearRect.width / 2,
              chevronsMask: getComputedStyle(vault, '::before').maskImage,
              x: rect.x, bottom: rect.bottom, width: rect.width,
              dockWidth: document.querySelector('.mod-left-split').getBoundingClientRect().width,
              name: getComputedStyle(document.querySelector('.workspace-drawer-vault-name')).display,
              content: getComputedStyle(vault, '::before').content,
              tabs: getComputedStyle(document.querySelector('.workspace-tabs')).display
            };
          });
          assert.equal(state.x, 0, `${theme}/${layout}: left edge`);
          assert(state.bottom <= 720 && state.bottom >= 690, JSON.stringify(state));
          assert(state.width >= 32, JSON.stringify(state));
          assert.equal(state.dockWidth, 0);
          assert.equal(state.name, 'none');
          assert.equal(state.tabs, 'none');
          assert.equal(state.content, '""');
          assert(state.chevronsMask.includes('data:image/svg+xml'));
          assert(Math.abs(state.vaultCenter - state.gearCenter) < 0.1, 'Vault and gear horizontal centers align');
          await page.locator('.workspace-drawer-vault-switcher').click({ timeout: 2000 });
          await page.locator('#settings').click({ timeout: 2000 });
          assert.deepEqual(await page.evaluate(() => window.hits), ['vault', 'settings']);
          if (!layout) await page.screenshot({ path: path.join(output, `${theme}-${mode}-collapsed.png`) });
          await page.evaluate(() => {
            document.querySelector('.workspace').classList.add('is-left-sidedock-open');
            document.querySelector('.workspace-ribbon').classList.remove('is-collapsed');
            const dock = document.querySelector('.mod-left-split');
            dock.classList.remove('is-sidedock-collapsed');
            dock.style.cssText = 'width:240px';
          });
          assert.deepEqual(await page.locator('.workspace-sidedock-vault-profile').boundingBox(), original, 'Expanded layout restored');
          results.push({ theme, mode, layout: layout || 'default', ...state });
        }
      }
    }
    fs.writeFileSync(path.join(output, 'collapsed-sidebar.json'), JSON.stringify(results, null, 2));
    console.log(`${results.length} collapsed/expanded layout cases passed; both native-control click targets reachable.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
