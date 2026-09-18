# AbsolutelyGlass 验证记录

[English](./VALIDATION.md) | **中文**

验证日期：2026-09-18。

## 1.0.4 侧栏文字对比度

- 仅在左右侧栏与功能区作用域覆盖正文/次要/弱化文字、文件名、折叠箭头、标签文字及图标颜色；浅色正文 #101211，深色正文 #ffffff。
- 未增加背景、阴影或字体粗细，未修改正文编辑区、设置页或配套插件。
- 使用 1.13.7 样式的浏览器验证通过，已查看浅色侧栏预览；透明桌面实际对比度随壁纸变化，未宣称固定 WCAG 对比度或实机视觉验证。

## 1.0.3 两侧栏透明化

- 左右侧栏叶面板背景与边框设为透明，去除渐变、圆角、阴影与额外 backdrop-filter，保留窗口底层 Acrylic 和导航选中状态。
- 用 1.13.7 app.css 检查深浅色下左右两个侧栏的背景/边框均透明，背景图、阴影和模糊均 none；正文仍保持 alpha=0.64 的玻璃面板。
- 浏览器渲染及既有回归通过，已查看浅色预览；未进行 Obsidian 原生窗口视觉确认。

## 1.0.2 设置独立窗口修正

- 用户反馈 1.0.1 已解决主题切换卡死，但设置顶部深色横栏仍存在。
- 读取当前运行版本 `%APPDATA%\obsidian\obsidian-1.13.7.asar` 的 app.js/app.css，确认独立设置窗口使用 `body.is-popout-modal > .modal` 与独立 `.titlebar`。此前验证使用安装包 1.12.7，普通 modal-container 夹具漏掉了此结构。
- 对此作用域设置实色窗口、实色标题栏、无模糊的直接子 modal，恢复 Obsidian 自带窗口控制 SVG；未修改插件。
- 改用 1.13.7 app.css 完成全部回归，并增加深浅色独立设置窗口检查：标题栏/body/modal 三者背景一致（浅色 rgb(245,242,236)，深色 rgb(39,40,36)），标题栏高度 30 px，关闭图标可见，modal 模糊与动画均 none。
- 已检查独立设置页浅色截图；仍不等于实际 Electron 独立窗口的合成验证。
- 最新验证命令的第三个参数使用 `%APPDATA%\obsidian\obsidian-1.13.7.asar`，不再使用下方历史记录中的安装包路径。

## 1.0.1 修复回归

- 标签页 `::before` / `::after` 的计算样式均为 `content: none`，移除底部两侧反向圆角；深浅色浏览器截图已更新。
- 设置弹窗使用实色背景，计算样式确认 `backdrop-filter: none`、`animation-name: none`、`transform: none`，截图为 `AbsolutelyGlass-settings.png`。
- 在真实浏览器 DOM / MutationObserver 中复现旧版对不存在 class 反复 remove 导致的通知循环，在第 24 次主动截断。
- 用新版完整插件代码和真实 DOM 运行六轮主题往返，每次发出 40 个 `css-change` 事件：共 14 次同步、7 次 Acrylic 设置和 7 次恢复，稳定后额外同步 0 次，卸载后同步 0 次，未残留材质标记。
- Electron 窗口接口仍为模拟接口；未声称 Obsidian 实机卡死或 Windows 顶部绘制异常已全部消除。
- 插件从立即执行改为 160 ms 合并更新；class 监听只关注深浅色与不透明模式，忽略自身标记及无关 class；卸载取消待执行任务并断开观察器。
- 要让正在运行的旧版插件代码退出，保存笔记并完整关闭、重新打开 Obsidian。仅重载 CSS 不会替换内存中的插件代码。

## 已完成

- `build.ps1` 成功生成 `theme.css`；开头 637,125 字节与当前 AbsolutelyBaseline 的 `theme.css` 逐字节相同。（2026-09-18 更新：基础主题被裁短后重新构建；此前的数字是 640,976。）
- 主题及插件 manifest JSON 均可解析；配套插件通过 `node --check`。
- 使用本机已有 Playwright 与 Edge，在从本机 Obsidian 安装包读取的 `app.css` 上加载完整派生主题，渲染三栏 DOM 验证夹具；深色、浅色截图均已查看。
- 浏览器计算样式确认：面板 alpha=0.64、磨砂 `blur(24px) saturate(1.25)`、圆角 16 px、正文容器透明；原生标记启用后窗口 CSS alpha=0.12；不透明模式面板 alpha=1。
- 插件七项模拟检查通过：主题切换恢复、卸载恢复、不透明模式恢复、Acrylic 接口异常回退、旧版 Windows 回退、非 Windows 回退、减少透明效果模式不启用材质。
- 未修改 AbsolutelyBaseline、笔记、当前主题选择和第三方插件启用列表。

## 未验证与限制

- 未在正在运行的 Obsidian 中启用新主题或插件；没有验证 Windows DWM 实际桌面透视、焦点切换、最大化、多屏表现。
- 原生桌面控制工具在本次会话不可用，不能将浏览器夹具截图当作 Obsidian 实机截图。
- 浏览器夹具检查不覆盖 Obsidian 的所有 DOM、编辑交互、社区插件面板、移动端和导出 PDF。
- Python 独立 CSS 解析尝试因运行环境没有 `tinycss2` 而未执行；未安装新依赖。上述 CSS 验证使用浏览器原生解析与计算样式。

## 可复现命令

在知识库根目录用 PowerShell 执行：

```powershell
& .obsidian\themes\AbsolutelyGlass\build.ps1
node --check .obsidian\plugins\absolutely-glass-acrylic\main.js
node .obsidian\themes\AbsolutelyGlass\verify.cjs `
  '%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules' `
  'D:\obsidianPlugin\.verify-out' `
  '%APPDATA%\obsidian\obsidian-1.13.7.asar'
```

截图及机器可读结果位于上述输出目录：`AbsolutelyGlass-dark.png`、`AbsolutelyGlass-light.png`、`validation.json`。其他电脑需要替换运行时、输出目录和 Obsidian 安装路径。
