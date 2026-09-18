# AbsolutelyGlass

[English](./README.md) | **中文**

一个暖色调、带玻璃面板的 Obsidian 主题。AbsolutelyGlass 保留 [AbsolutelyBaseline](https://github.com/dingye0604/AbsolutelyBaseline) 的布局、组件与动效，在其上叠加一层半透明磨砂材质；在 Windows 11 上，可选的配套插件还能让真实桌面透出来。

| 浅色 | 深色 |
| :---: | :---: |
| [![AbsolutelyGlass 浅色](./screenshot-light.jpg)](./Fig1.jpg) | [![AbsolutelyGlass 深色](./screenshot-dark.jpg)](./Fig2.jpg) |

*点击截图查看原尺寸。*

## 这是什么

AbsolutelyGlass 是一条链上的第三层：

```
Baseline            社区主题，作者 aaaa-alexis（MIT）
  └─ AbsolutelyBaseline 沿用 Baseline 布局，替换为暖色 Claude 风配色与排版
       └─ AbsolutelyGlass 玻璃面板、环境色、半透明窗口
```

玻璃之下的一切都属于 AbsolutelyBaseline。AbsolutelyGlass 只是在最上层追加材质，不 fork、不替换基础样式。

两种效果，由你选择要哪一种：

- **只用主题。** 暖色中性底色，加上主题自己绘制的 CSS 磨砂面板。全平台可用。桌面**不会**透出来——因为面板背后只有主题自己的背景，模糊无物可模糊。
- **主题 + 配套插件。** 在 Windows 11 22H2 及以上，可选的 [AbsolutelyGlass Acrylic](https://github.com/dingye0604/absolutely-glass-acrylic) 插件会向 Electron 申请原生 Acrylic 材质，让真实桌面透过窗口。

后者是真实的桌面材质，**不是** Apple 的 Liquid Glass，也不含动态折射。

## 安装

### 从社区主题库

1. **设置 → 外观 → 主题 → 管理**
2. 搜索 **AbsolutelyGlass**
3. **安装并使用**

### 手动安装

1. 从 [最新 release](https://github.com/dingye0604/AbsolutelyGlass/releases/latest) 下载 `manifest.json` 和 `theme.css`
2. 在 `<你的库>/.obsidian/themes/` 下新建文件夹 `AbsolutelyGlass`
3. 把两个文件放进去
4. 重启 Obsidian，然后在 **设置 → 外观 → 主题** 里选择 **AbsolutelyGlass**

### 可选：Windows 11 原生 Acrylic

安装并启用 [AbsolutelyGlass Acrylic](https://github.com/dingye0604/absolutely-glass-acrylic) 插件即可，不需要其他配置——插件会自己识别主题。

插件只管理主窗口。不要与其他 Mica/Acrylic 窗口插件同时启用。

## 设置

安装 [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) 后，**AbsolutelyGlass · 玻璃材质** 提供：

| 选项 | 默认值 | 说明 |
|---|---|---|
| 面板不透明度 | `0.64` | 桌面背景太杂时调高 |
| 窗口底色 | `0.12` | 玻璃背后窗口回退色 |
| 模糊半径 | `24 px` | 机器卡顿时调低 |
| 圆角 | `16 px` | 面板圆角 |

深浅色分别调校，均支持。另有 **高可读性 · 不透明模式** 预设，完全关闭玻璃——想要布局但不想要任何透明时使用。

Style Settings 面板里的其他选项来自 AbsolutelyBaseline，全部继续可用。AbsolutelyGlass 的材质覆盖优先于部分 Baseline 的背景与边框选项。

## 系统要求

- Obsidian **1.13.4** 或更高
- **原生 Acrylic** 额外要求 Windows 11 22H2（build 22621+），且 Obsidian 安装程序提供 Electron 窗口材质接口
- macOS、Linux、移动端只能得到主题的 CSS 玻璃效果；插件仅支持 Windows 桌面，在其他平台保持不激活

是否真正启用 Acrylic 由 Windows 决定。系统「透明效果」关闭、节能模式、远程桌面、显卡驱动回退都可能强制窗口变为实色——主题无法覆盖这些系统策略。失焦时的材质变化由 Windows 管理。

## 常见问题

**桌面透不出来。** 插件没生效。确认插件已启用、系统是 Windows 11 22H2 或更高、且「设置 → 辅助功能 → 视觉效果 → 透明效果」已打开。可用命令面板的 **AbsolutelyGlass Acrylic: 重新应用 Acrylic 磨砂背景** 重试。

**主题换了但 Obsidian 外观没变。** CSS 会立即重载，插件代码不会。保存笔记后彻底重启 Obsidian。

**壁纸太花，文字看不清。** 调高面板不透明度，或开启不透明模式。

**想换回去。** 选择 AbsolutelyBaseline（或任意其他主题）即可——插件检测到主题标记消失后会恢复窗口。停用插件同样会恢复原窗口背景色并移除自身 CSS 标记，不修改任何 Windows 设置。

## 致谢

AbsolutelyGlass 是派生作品，你看到的大部分是别人的工作。

- **[Baseline](https://github.com/aaaaalexis/obsidian-baseline)**，作者 [aaaaalexis](https://github.com/aaaaalexis)，MIT 许可。全部布局、组件与动效代码。Baseline 自身又致谢了它借鉴的社区主题，权威名单见其仓库。
- **[AbsolutelyBaseline](https://github.com/dingye0604/AbsolutelyBaseline)**——本主题的直接基础，配色与排版原样继承。
- **Instrument Serif**——Copyright 2022 The Instrument Serif Project Authors，设计者 Rodrigo Fuenzalida 与 Jordan Egstad。SIL Open Font License 1.1，以 base64 WOFF2 形式内嵌于 `theme.css`。
- **Inter**——作者 Rasmus Andersson，SIL Open Font License 1.1。仅按名称引用，随 Obsidian 分发。

配色与排版方向受 **Claude** 启发。

### 免责声明

这是独立的社区主题，**与 Anthropic 无隶属、赞助或背书关系**。「Claude」是 Anthropic PBC 的商标，此处仅用于描述本主题所借鉴的视觉风格。

## 许可

[MIT](./LICENSE) © AbsolutelyGlass 作者，包含 AbsolutelyBaseline 与 Baseline © 2025 aaaa​alexis。

内嵌与引用的字体另有 SIL Open Font License 1.1 授权，见 [致谢](#致谢)。

## 面向开发者

`theme.css` 是构建产物：`AbsolutelyBaseline/theme.css` 之后拼接 `glass.css`。改 `glass.css` 后需要重新构建。详见 [DEVELOPMENT.md](./DEVELOPMENT.md)，以及 [VALIDATION.zh-CN.md](./VALIDATION.zh-CN.md)（记录已验证与未验证的范围）。
