# AbsolutelyGlass 验证记录

## 1.0.10 — 圆形光晕色带改善（2026-10-14）

- 将低透明度 CSS 渐变及模糊替换为内嵌 320px PNG，采用高斯衰减和固定随机种子的透明度抖动。强度控制图层透明度，不引入网络资源或依赖。
- 使用已安装 Obsidian 1.14.4 CSS 的完整测试库验证通过，包括强度调节和鼠标生命周期。已查看深浅色截图：`.verify-out/smooth-glow-20261014/`。
- 仅浏览器夹具验证；Obsidian 实机、显示缩放和实际显示器上的色带未验证。重新加载主题 CSS 生效。

## 1.0.10 — 圆形柔光（2026-10-14）

- 按用户要求改回以鼠标为中心的 320px 圆形，保留低亮度和 18px 柔边。
- 完整测试库验证通过，包含深浅色鼠标定位和生命周期检查。证据：`.verify-out/round-glow-20261014/`。仅浏览器夹具验证，未验证 Obsidian 实机。

## 1.0.10 — 鼠标柔光调整（2026-10-14）

- 将圆形光晕改为两片错位的宽扁渐变，降低峰值亮度并增加 18px 柔边。保留强度调节，不增加拖尾或呼吸动画。
- 使用已安装 Obsidian 1.14.4 CSS 的完整测试库 `verify.cjs` 通过，已查看深浅色夹具截图。证据：`.verify-out/soft-reflection-20261014-verified/`。基线前缀保持 640745 字节。
- 未验证 Obsidian 实机及 Windows 合成。这次仅修改 CSS，重新加载主题即可应用。

## 1.0.10 + Acrylic 1.0.3 — 最终范围：仅保留鼠标光晕（2026-10-14）

### 已完成

- 按用户要求移除失焦背景开关、对应 CSS 覆盖和插件策略；保留光晕及失焦、离开时的隐藏逻辑。下方失焦策略记录属于已撤回的本地实现。
- 语法检查与测试库完整 `verify.cjs` 通过，使用已安装 Obsidian 1.14.4 CSS：10 项原生接口模拟、深浅色光晕、失焦隐藏、设置独立窗口及生命周期回归均通过。基线前缀仍为 640745 字节。
- 备份测试库副本后经 `sync.ps1` 同步。证据：`.verify-out/remove-focus-option-20261014/validation.json`。

### 未验证与限制

- 未验证 Obsidian 实机与 Windows 合成；需重启 Obsidian 加载新插件代码。未推送或发布。

## 1.0.10 + Acrylic 1.0.3 — 失焦策略与鼠标光晕（2026-10-14）

### 已完成

- `node --check absolutely-glass-acrylic/main.js` 通过；通过 `sync.ps1` 构建、同步，保留基线 640745 字节前缀。
- 首次同步前，测试库中的相关主题与插件副本已备份到 `.backup/focus-glow-20261014-110817/`。
- 使用已有外部 Playwright 和已安装的 Obsidian 1.14.4 ASAR 运行测试库 `verify.cjs`，10 项原生接口模拟用例、设置独立窗口和 MutationObserver 回归均通过。
- 深浅色真实 DOM 浏览器检查通过：默认失焦保留材质请求；开启失焦实色后恢复原生背景并显示 CSS 实色；聚焦重新申请 Acrylic。鼠标位置、点击穿透命中测试、强度调节、离开隐藏及关闭开关移除光晕均通过。
- 减少动态效果、不透明模式、切换主题、打印隐藏和待执行动画帧下卸载清理均通过；已查看深浅色光晕夹具截图。
- 证据：`.verify-out/focus-glow-20261014-final/validation.json` 及同目录 `AbsolutelyGlass-glow-{dark,light}.png`。Git 空白检查通过。

### 未验证与限制

- 浏览器使用模拟的 Electron 接口和合成焦点事件，不是 Obsidian 实机验证。已核对安装的 ASAR，未核实运行中应用版本及 Windows/DWM 的后台 Acrylic 合成。
- 保留透明请求不能强制 Windows 在失焦时继续绘制 Acrylic。功能仅作用于主窗口，插件更新需要完全退出并重启应用。
- 未提交、推送或发布。

## 1.0.9 — 顶部固定侧边栏按钮与 Acrylic 恢复（2026-10-09）

### 已完成

- 从 AbsolutelyBaseline 1.0.2 重建，保留 640745 字节基线前缀。非 macOS 桌面工具栏预留标题栏格子，按钮固定在插件图标上方。
- 核实本地 Obsidian 1.14.4 app.js 仅为工具栏添加 mod-primary，没有 mod-left。选择器兼容新旧类名。此前夹具错误地同时添加两类，其通过结果不能证明新版兼容。
- 修正后的 verify-sidebar-toggle.cjs 复现旧问题并通过 256 项检查：新旧类名单独测试，覆盖两个主题、深浅色、八种布局、展开/收起及插入顺序。检查图标本体边界、点击可达，以及增加图标和间距后坐标不变；已查看修复前后夹具截图。
- 完整 verify.cjs 通过十项插件生命周期 mock、设置/独立窗口、偏好恢复及重试回归。本次改动期间原有收起控件夹具 32 项检查通过。
- Acrylic 1.0.2 修复已启用时重试直接返回，并在支持时监听系统透明/高对比偏好。用户确认另一台设备的不透明现象由节能模式引起。
- 证据：.verify-out/sidebar-primary-20261009/ 和 .verify-out/sidebar-pinned-top-20261009/collapsed/。源码已同步本地测试库。

### 未验证与限制

- 仅浏览器夹具及模拟 Electron 接口；本代理未验证 Obsidian 实机位置或 Windows DWM 合成。API 成功不保证实际桌面透明。
- Git 推送与发布可下载的 GitHub Release 附件是独立步骤。

## 1.0.8 — 玻璃面板与块透明度联动（2026-10-03）

### 已完成

- 移除独立面板模糊滑块，CSS 模糊固定为 24 px。
- 引用块采用 16% 基础底色和 26.4 px 阅读模式模糊；引用块、代码块背景随正文不透明度变化，0 时保留轻底色，1 时变为实色；行内代码不变。
- 本地 Obsidian 1.13.7 CSS 下原有 verify.cjs 通过。深浅色正文不透明度 0、0.5、1 的六组专项检查通过，覆盖阅读引用块、代码块和模拟编辑行。基线前缀：639894 字节。
- 证据：.verify-out/remove-blur-20261003/、.verify-out/glass-quotes-20261003/、.verify-out/glass-quotes-refined-20261003/、.verify-out/linked-opacity-20261003/。

### 未验证与限制

- 仅浏览器夹具；未验证 Obsidian 实机、CodeMirror 编辑交互与 Windows Acrylic 合成器。

## 1.0.7 — 收起侧栏的仓库与设置入口（2026-10-01）

### 已完成

- AbsolutelyBaseline 1.0.1 提供共用样式，Glass 重新构建并保留 639894 字节基线前缀。
- 收起左侧栏时，原生仓库入口以 `<>` 显示于最左侧底部，设置保留原生图标；展开后恢复原布局。
- 使用本地 Obsidian 1.13.7 app.css，`verify-collapsed-sidebar.cjs` 验证两个主题、深浅色、默认及七种命名布局，共 32 项；检查折叠容器零宽度、按钮位置、点击可达和展开恢复。点击处理器为夹具模拟。
- 原有 `verify.cjs` 全部通过，包含七项插件生命周期模拟、独立设置窗口及 MutationObserver 回归。已查看收起状态截图。
- 证据：`.verify-out/collapsed-sidebar-20261001/`。源码通过 `sync.ps1` 同步到测试库。


- 对齐修正：将字体尖括号换为对称矢量图标，统一按钮居中；32 项场景新增横向中心一致断言并通过，原有回归再次通过。证据：`.verify-out/collapsed-sidebar-alignment-20261001/`。

### 未验证与限制

- 未验证 Obsidian 实机、真实仓库菜单及设置窗口打开行为、Windows 合成、移动端和非默认悬停/隐藏功能区组合。

## 1.0.6 — 深色标签文字（2026-09-28）

### 已完成

- 使用本地 Obsidian 1.13.7 app.css 的完整浏览器夹具通过，包含七项插件模拟及 MutationObserver 回归。
- 深色标签文字为白色，浅色保留近黑色，覆盖选中、未选中、悬停、聚焦与失焦。基线前缀保留 637129 字节。
- 证据：.verify-out/2026-09-28-dark-tabs/。

### 未验证与限制

- 未验证 Obsidian 实机与 Windows 合成效果。

## 1.0.5 — 连续标签与零不透明度（2026-09-27）

### 已完成

- 插件语法检查通过；使用本地 Obsidian 1.13.7 app.css 的完整浏览器夹具通过，包含七项插件生命周期模拟与 MutationObserver 回归。
- 深浅色下，标签在选中、未选中、悬停、窗口聚焦与失焦时均保持 rgb(16, 18, 17)。选中标签与正文无间隙连接。
- 不透明度为 0、0.35、1 时，选中标签与正文的底色、模糊和饱和度一致；圆角使用单个连续 CSS shape() 材质层，未选中标签不额外模糊。
- 保留基线前缀 637129 字节。已查看浏览器夹具截图；证据：工作区 .verify-out/2026-09-27-continuous-tab/。

### 未验证与限制

- 未验证 Obsidian 实机和 Windows DWM 合成。当前 Edge 支持 CSS shape()，Obsidian 实际渲染仍未验证。深黑文字在暗背景上的对比度有限。

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
