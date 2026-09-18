# AbsolutelyGlass validation record

**English** | [中文](./VALIDATION.zh-CN.md)

Validated 2026-09-18.

## 1.0.4 — Sidebar text contrast

- Overrode body, secondary, and faint text plus filenames, collapse arrows, tab labels, and icon colors, scoped to the left and right sidebars and the ribbon only. Light-mode body text `#101211`, dark-mode `#ffffff`.
- No backgrounds, shadows, or font weights were added. The note editor, settings pages, and companion plugin were not touched.
- Verified in a browser against the 1.13.7 stylesheets; the light-mode sidebar preview was inspected. Contrast over a transparent desktop varies with the wallpaper — no fixed WCAG ratio is claimed, and there was no on-device visual verification.

## 1.0.3 — Transparent sidebars

- Set the sidebar leaf panel background and border to transparent and removed the gradient, corner radius, shadow, and extra `backdrop-filter`, keeping the window's underlying Acrylic and the navigation active state.
- Checked against 1.13.7 `app.css`: in both color modes the left and right sidebar backgrounds and borders are transparent, and background-image, shadow, and blur are all `none`. The note body still uses the alpha 0.64 glass panel.
- Browser rendering and the existing regression suite passed; the light-mode preview was inspected. No native Obsidian window confirmation.

## 1.0.2 — Settings pop-out window fix

- User feedback: 1.0.1 fixed the theme-switch freeze, but the dark bar at the top of settings remained.
- Read `app.js` / `app.css` from the running build, `C:\Users\CDL\AppData\Roaming\obsidian\obsidian-1.13.7.asar`, and confirmed the separate settings window uses `body.is-popout-modal > .modal` with its own `.titlebar`. Earlier validation had used the 1.12.7 installer, whose plain modal-container fixture misses that structure.
- Scoped to that context: solid window, solid title bar, direct child modal with no blur, and Obsidian's own window-control SVG restored. The plugin was not modified.
- Re-ran the full regression against 1.13.7 `app.css` and added light and dark checks for the separate settings window: title bar, body, and modal backgrounds match (light `rgb(245,242,236)`, dark `rgb(39,40,36)`), title bar height 30 px, close icon visible, modal blur and animation both `none`.
- The light-mode settings screenshot was inspected. This still does not amount to verifying composition in a real Electron pop-out window.
- The third argument of the current command is `C:\Users\CDL\AppData\Roaming\obsidian\obsidian-1.13.7.asar`; the installer path in the historical record below is no longer used.

## 1.0.1 — Regression fixes

- Computed styles for the tab `::before` / `::after` are both `content: none`; the inverted corner shapes at the bottom of tabs are gone. Light and dark browser screenshots were refreshed.
- The settings modal uses a solid background; computed styles confirm `backdrop-filter: none`, `animation-name: none`, `transform: none`. Screenshot: `AbsolutelyGlass-settings.png`.
- Reproduced the old notification loop — repeatedly removing a class that is not present — in a real browser DOM with a `MutationObserver`, and cut it off deliberately at the 24th callback.
- Ran six theme round-trips with the complete new plugin code against a real DOM, emitting 40 `css-change` events each time: 14 syncs in total, 7 Acrylic applications and 7 restores, 0 extra syncs once settled, 0 syncs after unload, no leftover material marker.
- The Electron window interface is still mocked. No claim is made that the Obsidian freeze or the Windows top-edge rendering problem is fully eliminated on-device.
- The plugin changed from running immediately to coalescing updates over 160 ms; the class observer now watches only color mode and solid mode, ignoring its own marker and unrelated classes; unload cancels pending timers and disconnects the observer.
- To get old plugin code out of a running app, save your notes and fully quit and reopen Obsidian. Reloading CSS alone does not replace plugin code in memory.

## Completed

- `build.ps1` regenerates `theme.css`; its leading 637,125 bytes are byte-identical to the current `AbsolutelyBaseline/theme.css`. Updated 2026-09-18 after the base was trimmed — the earlier figure was 640,976.
- Both manifests parse as JSON; the companion plugin passes `node --check`.
- Using the machine's existing Playwright and Edge, the full derived theme was loaded over the `app.css` read from the local Obsidian installation and rendered against a three-pane DOM fixture. Light and dark screenshots were inspected.
- Computed styles confirm: panel alpha 0.64, blur `blur(24px) saturate(1.25)`, 16 px radius, transparent note container; window CSS alpha 0.12 with the native marker set; panel alpha 1 in solid mode.
- Seven mocked plugin checks pass: restore on theme switch, restore on unload, restore in solid mode, rollback when the Acrylic API throws, fallback on older Windows, fallback on non-Windows, and no material under the reduced-transparency preference.
- AbsolutelyBaseline, the notes, the current theme selection, and the enabled third-party plugins were not modified.

## Not verified / limitations

- The theme and plugin were not enabled in a running Obsidian. Windows DWM desktop-through transparency, focus changes, maximizing, and multi-monitor behavior were not verified.
- Native desktop control tooling was unavailable in that session, so browser fixture screenshots must not be presented as on-device screenshots.
- Browser fixtures do not cover Obsidian's full DOM, editor interaction, community plugin panels, mobile, or PDF export.
- A separate CSS parse in Python did not run because `tinycss2` was missing from the environment, and no new dependency was installed. The CSS checks above used the browser's own parser and computed styles.

## Reproducible commands

Run from the vault root in PowerShell:

```powershell
& .obsidian\themes\AbsolutelyGlass\build.ps1
node --check .obsidian\plugins\absolutely-glass-acrylic\main.js
node .obsidian\themes\AbsolutelyGlass\verify.cjs `
  'C:\Users\CDL\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules' `
  'D:\obsidianPlugin\.verify-out' `
  'C:\Users\CDL\AppData\Roaming\obsidian\obsidian-1.13.7.asar'
```

Screenshots and the machine-readable result land in the output directory: `AbsolutelyGlass-dark.png`, `AbsolutelyGlass-light.png`, `validation.json`. On another machine, replace the runtime, output directory, and Obsidian installation paths.
