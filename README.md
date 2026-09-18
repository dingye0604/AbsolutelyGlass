# AbsolutelyGlass

**English** | [中文](./README.zh-CN.md)

A warm, glass-panelled Obsidian theme. AbsolutelyGlass keeps the layout, components, and motion of [AbsolutelyBaseline](https://github.com/dingye0604/AbsolutelyBaseline) and adds a semi-transparent frosted layer — and on Windows 11, an optional companion plugin lets the real desktop show through.

| Light | Dark |
| :---: | :---: |
| [![AbsolutelyGlass in light mode](./screenshot-light.jpg)](./Fig1.jpg) | [![AbsolutelyGlass in dark mode](./screenshot-dark.jpg)](./Fig2.jpg) |

*Click a screenshot to view it full size.*

## What you get

AbsolutelyGlass is the third layer in a chain:

```
Baseline            community theme by aaaa-alexis (MIT)
  └─ AbsolutelyBaseline baseline layout, warm Claude-inspired palette and typography
       └─ AbsolutelyGlass glass panels, ambient tint, translucent window
```

Everything below the glass is AbsolutelyBaseline. AbsolutelyGlass only appends a material layer on top — it does not fork or replace the base styling.

Two levels of effect, and you choose which:

- **Theme only.** Warm neutral surfaces plus CSS frosted panels drawn by the theme itself. Works on every platform. The desktop does **not** show through — the blur has nothing but the theme's own background behind it.
- **Theme + companion plugin.** On Windows 11 22H2 or newer, the optional [AbsolutelyGlass Acrylic](https://github.com/dingye0604/absolutely-glass-acrylic) plugin asks Electron for a native Acrylic backdrop, so your actual desktop shows through the window.

The second is a genuine desktop material. It is **not** Apple's Liquid Glass, and there is no dynamic refraction.

## Installation

### From the community theme browser

1. **Settings → Appearance → Themes → Manage**
2. Search for **AbsolutelyGlass**
3. **Install and use**

### Manually

1. Download `manifest.json` and `theme.css` from the [latest release](https://github.com/dingye0604/AbsolutelyGlass/releases/latest)
2. Create a folder named `AbsolutelyGlass` inside `<your-vault>/.obsidian/themes/`
3. Put both files in that folder
4. Reload Obsidian, then pick **AbsolutelyGlass** in **Settings → Appearance → Themes**

### Optional: native Acrylic on Windows 11

Install the [AbsolutelyGlass Acrylic](https://github.com/dingye0604/absolutely-glass-acrylic) plugin and enable it. Nothing else is required — the plugin finds the theme on its own.

The plugin manages the main window only. Do not run it alongside another Mica/Acrylic window plugin.

## Settings

With [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) installed, **AbsolutelyGlass · Glass material** exposes:

| Setting | Default | Notes |
|---|---|---|
| Panel opacity | `0.64` | Raise it when text sits over a busy desktop |
| Window tint | `0.12` | The color the window falls back to behind the glass |
| Blur radius | `24 px` | Lower it on machines that feel sluggish |
| Corner radius | `16 px` | Panel corners |

Both light and dark are supported and tuned separately. There is also a **High readability · solid mode** preset that drops the glass entirely — use it when you want the layout without any transparency.

Everything else in the Style Settings panel comes from AbsolutelyBaseline and still works. AbsolutelyGlass's material overrides take priority over some of Baseline's background and border options.

## Requirements

- Obsidian **1.13.4** or newer
- **Native Acrylic** additionally needs Windows 11 22H2 (build 22621+) and an Obsidian installer that exposes Electron's window material API
- macOS, Linux, and mobile get the theme's CSS glass; the plugin is desktop Windows only and stays inactive elsewhere

Windows decides on its own when to honor Acrylic. Transparency effects turned off system-wide, power saving, Remote Desktop, or a graphics driver fallback can all force an opaque window — the theme cannot override those policies. Material changes on focus loss are managed by Windows.

## Troubleshooting

**The desktop doesn't show through.** The plugin is not active. Check that it is enabled, that you are on Windows 11 22H2 or newer, and that Settings → Accessibility → Visual effects → Transparency effects is on. Run **AbsolutelyGlass Acrylic: Reapply Acrylic backdrop** from the command palette to retry.

**The theme changed but Obsidian kept the old look.** CSS reloads immediately, but plugin code does not. Save your notes and restart Obsidian completely.

**Text is hard to read over a busy wallpaper.** Raise panel opacity, or switch on solid mode.

**Switching back.** Choose AbsolutelyBaseline (or any other theme) — the plugin notices the theme is gone and restores the window. Disabling the plugin also restores the original window background color and removes its CSS marker. It does not touch any Windows setting.

## Credits

AbsolutelyGlass is a derivative work and most of what you see is other people's work.

- **[Baseline](https://github.com/aaaaalexis/obsidian-baseline)** by [aaaaalexis](https://github.com/aaaaalexis) — MIT. All layout, component, and motion code. Baseline in turn credits the community themes it drew from; see its repository for the authoritative list.
- **[AbsolutelyBaseline](https://github.com/dingye0604/AbsolutelyBaseline)** — the direct base of this theme. Its palette and typography are inherited unchanged.
- **Instrument Serif** — Copyright 2022 The Instrument Serif Project Authors, designed by Rodrigo Fuenzalida and Jordan Egstad. SIL Open Font License 1.1. Embedded in `theme.css` as a base64 WOFF2.
- **Inter** — by Rasmus Andersson, SIL Open Font License 1.1. Referenced by name only; it ships with Obsidian.

The palette and typography direction are inspired by **Claude**, Anthropic's AI assistant.

### Disclaimer

This is an independent, community-made theme. It is **not affiliated with, sponsored by, or endorsed by Anthropic**. "Claude" is a trademark of Anthropic PBC, referenced here only to describe the visual style this theme draws on.

## License

[MIT](./LICENSE) © the AbsolutelyGlass authors, incorporating AbsolutelyBaseline and Baseline © 2025 aaaa​alexis.

Bundled and referenced fonts are licensed separately under the SIL Open Font License 1.1 — see [Credits](#credits).

## For developers

`theme.css` is a build artifact: `AbsolutelyBaseline/theme.css` followed by `glass.css`. Edit `glass.css`, then rebuild. See [DEVELOPMENT.md](./DEVELOPMENT.md), and [VALIDATION.md](./VALIDATION.md) for what has and has not been verified.
