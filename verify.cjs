// Run: node verify.cjs <bundled-node-modules> <output-directory> <obsidian.asar>
// Browser fixture, NOT a screenshot of the running Obsidian application.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const [modules, output, asarPath] = process.argv.slice(2);
fs.mkdirSync(output, { recursive: true });
const theme = fs.readFileSync(path.join(__dirname, 'theme.css'));
const base = fs.readFileSync(path.join(__dirname, '../ClaudeBaseline/theme.css'));
assert(theme.subarray(0, base.length).equals(base), 'Base theme bytes changed');
for (const file of ['manifest.json', '../../plugins/claudeapple-glass/manifest.json']) {
  JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}
const pluginSource = fs.readFileSync(path.join(__dirname, '../../plugins/claudeapple-glass/main.js'), 'utf8');
const cases = [];
function pluginCase(name, options = {}) {
  const classes = new Set();
  const calls = [];
  const notices = [];
  let marker = '1';
  const nativeWindow = {
    getBackgroundColor: () => '#112233', isDestroyed: () => false,
    setBackgroundColor: value => calls.push(['color', value]),
    setBackgroundMaterial: value => {
      calls.push(['material', value]);
      if (options.fail && value === 'acrylic') throw Error('simulated unavailable material');
    }
  };
  const body = { classList: { contains: v => classes.has(v), add: v => classes.add(v), remove: v => classes.delete(v) } };
  const context = {
    clearTimeout,
    module: { exports: {} }, process: { platform: options.platform || 'win32' },
    document: { body }, getComputedStyle: () => ({ getPropertyValue: () => marker }),
    require: name => {
      if (name === 'obsidian') return { Plugin: class {}, Notice: class { constructor(v) { notices.push(v); } } };
      if (name === 'os') return { release: () => options.os || '10.0.26200' };
      if (name === '@electron/remote') return { getCurrentWindow: () => nativeWindow };
      throw Error(name);
    }
  };
  vm.runInNewContext(pluginSource, context);
  const plugin = new context.module.exports();
  plugin.media = { matches: !!options.reduced };
  plugin.sync();
  if (options.fail || options.os || options.platform) {
    assert(!plugin.active && !classes.has('ca-native-glass'));
    assert.equal(notices.length, 1);
    plugin.sync(); assert.equal(notices.length, 1, 'Repeated error notice');
    if (options.fail) assert.deepEqual(calls.at(-1), ['color', '#112233']);
  } else if (options.reduced) {
    assert.equal(calls.length, 0);
  } else {
    assert(plugin.active && classes.has('ca-native-glass'));
    const count = calls.length; plugin.sync(); assert.equal(calls.length, count);
    if (options.unload) plugin.onunload();
    else if (options.solid) { classes.add('ca-solid'); plugin.sync(); }
    else { marker = ''; plugin.sync(); }
    assert(!plugin.active && !classes.has('ca-native-glass'));
    assert.deepEqual(calls.at(-1), ['color', '#112233']);
    assert.deepEqual(calls.at(-2), ['material', 'auto']);
  }
  cases.push(name);
}
pluginCase('theme switch restores background');
pluginCase('unload restores background', { unload: true });
pluginCase('solid mode restores background', { solid: true });
pluginCase('API failure rolls back', { fail: true });
pluginCase('unsupported Windows falls back', { os: '10.0.19045' });
pluginCase('non-Windows falls back', { platform: 'darwin' });
pluginCase('reduced transparency skips material', { reduced: true });

function readAsar(file, entry) {
  const buffer = fs.readFileSync(file);
  const header = JSON.parse(buffer.subarray(16, 16 + buffer.readUInt32LE(12)));
  const item = header.files[entry];
  const start = 8 + buffer.readUInt32LE(4) + Number(item.offset);
  return buffer.subarray(start, start + item.size).toString();
}
const appCss = readAsar(asarPath, 'app.css');
const { chromium } = require(path.join(modules, 'playwright'));
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
    const fixture = `<!doctype html><html><head><meta charset="utf-8"></head>
    <body class="theme-dark mod-windows is-frameless"><div class="app-container"><div class="horizontal-main-container"><div class="workspace">
    <div class="workspace-split mod-left-split mod-sidedock"><div class="workspace-tabs"><div class="workspace-tab-header-container">文件</div><div class="workspace-tab-container"><div class="workspace-leaf"><div class="workspace-leaf-content" data-type="file-explorer"><div class="view-content"><div class="nav-files-container">
    <div class="nav-folder-title">Notebook</div><div class="nav-file-title">01 信号与系统</div><div class="nav-file-title is-active">02 山月记</div><div class="nav-file-title">03 研究与随笔</div></div></div></div></div></div></div></div>
    <div class="workspace-split mod-root"><div class="workspace-tabs"><div class="workspace-tab-header-container"><div class="workspace-tab-header is-active">山月记</div></div><div class="workspace-tab-container"><div class="workspace-leaf"><div class="workspace-leaf-content" data-type="markdown"><div class="view-header">书房 / 山月记</div><div class="view-content"><div class="markdown-preview-view"><div class="markdown-preview-sizer"><h1>山月记</h1><p>窗外的颜色轻轻透过玻璃，文字仍保持清晰。</p><h2>留一层光，留一点安静</h2><p>这是 CLaudeApple 的浏览器样式验证页。沿用 ClaudeBaseline 的阅读排版，加入半透明材质、柔和边缘和细微高光。</p><blockquote>这是 CSS 验证夹具，不是 Obsidian 实机截图。真实桌面 Acrylic 须在应用内启用配套插件后确认。</blockquote><h2>信号与系统</h2><p>阅读、写作、推导，仍然是笔记的中心。</p><pre><code>y[n] = sum(x[k] * h[n-k])</code></pre><p><a href="#details">继续阅读</a> · <span class="tag">学习笔记</span></p><table><thead><tr><th>参数</th><th>默认值</th></tr></thead><tbody><tr><td>面板不透明度</td><td>0.64</td></tr><tr><td>模糊半径</td><td>24 px</td></tr></tbody></table></div></div></div></div></div></div></div></div>
    <div class="workspace-split mod-right-split mod-sidedock"><div class="workspace-tabs"><div class="workspace-tab-header-container">大纲</div><div class="workspace-tab-container"><div class="workspace-leaf"><div class="workspace-leaf-content" data-type="outline"><div class="view-content"><h3>山月记</h3><p>留一层光，留一点安静</p><p>信号与系统</p><input aria-label="搜索" placeholder="搜索笔记"></div></div></div></div></div></div>
    </div></div></div></body></html>`;
    await page.setContent(fixture);
    await page.addStyleTag({ content: appCss });
    await page.addStyleTag({ content: theme.toString() });
    // The fixture supplies only window dimensions and dock widths; theme draws surfaces.
    await page.addStyleTag({ content: 'body{color:var(--text-normal)}.app-container{position:fixed;inset:0;display:flex;align-items:stretch!important}.horizontal-main-container{display:flex;flex:1}.workspace>.mod-left-split{width:240px!important;flex:0 0 240px!important}.workspace>.mod-right-split{width:260px!important;flex:0 0 260px!important}.workspace>.mod-root{width:auto!important;min-width:0;flex:1 1 0!important}.workspace-split>.workspace-tabs{width:100%;flex:1}.workspace-tab-container{width:100%;flex:1}.workspace-tab-container>.workspace-leaf{width:100%;flex:1}.workspace-leaf-content{display:flex;flex-direction:column}.view-content{flex:1;min-height:0}.horizontal-main-container,.workspace{width:100%;height:100%}.workspace{display:flex}.mod-left-split{width:240px;flex:none}.mod-right-split{width:260px;flex:none}.mod-root{flex:1}.workspace-tabs,.workspace-tab-container,.workspace-leaf{height:100%;min-height:0}.workspace-tab-header-container{min-height:42px;padding:10px}.markdown-preview-sizer{padding:24px}.workspace-leaf-content[data-type=outline] .view-content{padding:18px}.nav-file-title,.nav-folder-title{padding:10px}' });
    const results = [];
    for (const mode of ['dark', 'light']) {
      await page.evaluate(mode => { document.body.classList.remove('theme-dark', 'theme-light'); document.body.classList.add(`theme-${mode}`); }, mode);
      await page.waitForTimeout(900);
      await page.screenshot({ animations: 'disabled', path: path.join(output, `CLaudeApple-${mode}.png`) });
      const result = await page.evaluate(() => {
        const panel = document.querySelector('.mod-root .workspace-leaf-content');
        const style = getComputedStyle(panel);
        return { background: style.backgroundColor, blur: style.backdropFilter, radius: style.borderRadius,
          editor: getComputedStyle(document.querySelector('.markdown-preview-view')).backgroundColor,
          marker: getComputedStyle(document.body).getPropertyValue('--claudeapple-theme').trim() };
      });
      assert.equal(result.marker, '1'); assert(result.blur.includes('24px'));
      assert.equal(result.radius, '16px'); assert.equal(result.editor, 'rgba(0, 0, 0, 0)');
      assert(result.background.includes('0.64'));
      const corners = await page.evaluate(() => {
        const tab = document.querySelector('.mod-root .workspace-tab-header');
        return ['::before', '::after'].map(pseudo => getComputedStyle(tab, pseudo).content);
      });
      assert.deepEqual(corners, ['none', 'none']);
      const sidebars = await page.evaluate(() =>
        [...document.querySelectorAll('.mod-left-split .workspace-leaf-content, .mod-right-split .workspace-leaf-content')]
          .map(el => {
            const style = getComputedStyle(el);
            return { background: style.backgroundColor, image: style.backgroundImage,
              shadow: style.boxShadow, blur: style.backdropFilter, border: style.borderTopColor };
          }));
      assert.equal(sidebars.length, 2);
      for (const sidebar of sidebars) {
        assert.equal(sidebar.background, 'rgba(0, 0, 0, 0)');
        assert.equal(sidebar.image, 'none'); assert.equal(sidebar.shadow, 'none');
        assert.equal(sidebar.blur, 'none'); assert.equal(sidebar.border, 'rgba(0, 0, 0, 0)');
      }
      results.push({ mode, ...result });
    }
    await page.evaluate(() => document.body.classList.add('ca-native-glass'));
    const nativeBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert(nativeBackground.includes('0.12'));
    await page.evaluate(() => document.body.classList.add('ca-solid'));
    const solid = await page.evaluate(() => getComputedStyle(document.querySelector('.mod-root .workspace-leaf-content')).backgroundColor);
    assert(!solid.includes('0.64'));
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'modal-container';
      container.innerHTML = '<div class="modal-bg"></div><div class="modal mod-settings mod-sidebar-layout"><div class="modal-header">设置</div><div class="modal-content"><div class="vertical-tab-header">外观</div><div class="vertical-tab-content-container" style="flex:1;min-width:0"><div class="vertical-tab-content" style="width:100%"><div class="setting-page-titlebar">主题设置</div><p>设置窗口使用清晰实色表面。</p></div></div></div></div>';
      document.body.append(container);
    });
    const modal = await page.evaluate(() => {
      const style = getComputedStyle(document.querySelector('.modal'));
      return { blur: style.backdropFilter, animation: style.animationName, transform: style.transform, background: style.backgroundColor };
    });
    assert.equal(modal.blur, 'none'); assert.equal(modal.animation, 'none');
    assert.equal(modal.transform, 'none'); assert(modal.background.startsWith('rgb('));
    await page.screenshot({ animations: 'disabled', path: path.join(output, 'CLaudeApple-settings.png') });

    // 1.13+: settings is a separate window; .modal is a direct body child.
    const popoutPage = await browser.newPage({ viewport: { width: 1100, height: 760 } });
    await popoutPage.setContent('<html><head></head><body class="theme-light mod-windows is-frameless is-hidden-frameless is-popout-window is-popout-modal"><div class="titlebar"><div class="titlebar-inner"><div class="titlebar-text">设置</div><div class="titlebar-button-container mod-right"><div class="titlebar-button mod-close" aria-label="关闭"><svg width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M1 0L6 5L11 0L12 1L7 6L12 11L11 12L6 7L1 12L0 11L5 6L0 1Z"/></svg></div></div></div></div><div class="modal mod-settings mod-sidebar-layout"><div class="modal-content"><div class="vertical-tabs-container"><div class="vertical-tab-header"><div class="setting-search-container"><input placeholder="搜索设置…"></div><div class="vertical-tab-nav-item is-active">关于</div><div class="vertical-tab-nav-item">外观</div><div class="vertical-tab-nav-item">界面</div></div><div class="vertical-tab-content-container"><div class="vertical-tab-content"><h2>关于</h2><p>设置独立窗口 · 标题栏验证</p><div class="setting-item"><div class="setting-item-info"><div class="setting-item-name">Obsidian 1.13.7</div></div><div class="setting-item-control"><button>检查更新</button></div></div></div></div></div></div></div></body></html>');
    await popoutPage.addStyleTag({ content: appCss });
    await popoutPage.addStyleTag({ content: theme.toString() });
    const popoutResults = [];
    for (const mode of ['light', 'dark']) {
      await popoutPage.evaluate(mode => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${mode}`);
      }, mode);
      await popoutPage.waitForTimeout(400);
      const result = await popoutPage.evaluate(() => {
        const bar = getComputedStyle(document.querySelector('.titlebar'));
        const modal = getComputedStyle(document.querySelector('body > .modal'));
        return { titlebar: bar.backgroundColor, body: getComputedStyle(document.body).backgroundColor,
          modal: modal.backgroundColor, modalBlur: modal.backdropFilter, modalAnimation: modal.animationName,
          icon: getComputedStyle(document.querySelector('.titlebar-button path')).visibility,
          titlebarHeight: document.querySelector('.titlebar').getBoundingClientRect().height };
      });
      assert.equal(result.titlebar, result.body);
      assert.equal(result.titlebar, result.modal);
      assert.equal(result.modalBlur, 'none'); assert.equal(result.modalAnimation, 'none');
      assert.equal(result.icon, 'visible'); assert(result.titlebarHeight > 0);
      popoutResults.push({ mode, ...result });
      await popoutPage.screenshot({ animations: 'disabled', path: path.join(output, `CLaudeApple-settings-popout-${mode}.png`) });
    }
    await popoutPage.close();

    // Real DOM MutationObserver regression; only Electron/Obsidian APIs are mocked.
    const regressionPage = await browser.newPage();
    const regression = await regressionPage.evaluate(async source => {
      const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
      document.body.className = 'theme-light';
      document.body.style.setProperty('--claudeapple-theme', '1');
      // Reproduce the old restore loop, bounded so the test itself cannot freeze.
      let oldCallbacks = 0;
      await new Promise(resolve => {
        const observer = new MutationObserver(() => {
          if (++oldCallbacks >= 24) { observer.disconnect(); resolve(); return; }
          document.body.classList.remove('ca-native-glass');
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        document.body.classList.remove('ca-native-glass');
      });
      const cleanup = [], events = {}, calls = [];
      const win = { isDestroyed: () => false, getBackgroundColor: () => '#112233',
        setBackgroundColor: value => calls.push(['color', value]),
        setBackgroundMaterial: value => calls.push(['material', value]) };
      class Plugin {
        register(fn) { cleanup.push(fn); }
        registerEvent() {}
        registerDomEvent(el, name, fn) { el.addEventListener(name, fn); cleanup.push(() => el.removeEventListener(name, fn)); }
        addCommand() {}
      }
      const requireMock = name => {
        if (name === 'obsidian') return { Plugin, Notice: class {} };
        if (name === 'os') return { release: () => '10.0.26200' };
        if (name === '@electron/remote') return { getCurrentWindow: () => win };
        throw Error(name);
      };
      const module = { exports: {} };
      new Function('require', 'module', 'process', source)(requireMock, module, { platform: 'win32' });
      const plugin = new module.exports();
      plugin.app = { workspace: { on: (name, fn) => { events[name] = fn; }, onLayoutReady: fn => fn() } };
      let syncs = 0;
      const originalSync = plugin.sync.bind(plugin);
      plugin.sync = () => { syncs++; originalSync(); };
      plugin.onload();
      await pause(220);
      for (let index = 0; index < 6; index++) {
        document.body.style.setProperty('--claudeapple-theme', '0');
        for (let i = 0; i < 40; i++) events['css-change']();
        await pause(220);
        document.body.style.setProperty('--claudeapple-theme', '1');
        for (let i = 0; i < 40; i++) events['css-change']();
        await pause(220);
      }
      document.body.style.setProperty('--claudeapple-theme', '0');
      events['css-change']();
      await pause(220);
      const settled = syncs;
      await pause(220);
      const idleSyncs = syncs - settled;
      events['css-change'](); // Pending timer must be cancelled by unload.
      plugin.onunload(); cleanup.forEach(fn => fn());
      await pause(220);
      return { oldCallbacks, syncs, idleSyncs, afterUnload: syncs - settled,
        acrylicCalls: calls.filter(call => call[1] === 'acrylic').length,
        restoreCalls: calls.filter(call => call[1] === 'auto').length,
        markerRemains: document.body.classList.contains('ca-native-glass') };
    }, pluginSource);
    assert.equal(regression.oldCallbacks, 24);
    assert.equal(regression.syncs, 14);
    assert.equal(regression.idleSyncs, 0); assert.equal(regression.afterUnload, 0);
    assert.equal(regression.acrylicCalls, 7); assert.equal(regression.restoreCalls, 7);
    assert.equal(regression.markerRemains, false);
    await regressionPage.close();
    const report = { sourceBytesPreserved: base.length, pluginMockCases: cases, browserFixture: results, nativeBackground, solid,
      modal, popoutResults, appCssSource: asarPath, regression,
      limitation: 'Browser fixture and mocked lifecycle only; Windows compositor and live Obsidian unverified.' };
    fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
