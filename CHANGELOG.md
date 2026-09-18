# Changelog

## 1.0.4

- Raised text contrast in the left and right sidebars and in the ribbon: near-black in light mode, white and light grey in dark mode.
- Filenames, secondary text, and icons were the specific problem — they sat too close to the panel background once the glass layer was behind them.
- Transparent surfaces, note body, and settings colors are unchanged.
- Note: the desktop shows through, so actual contrast still varies with the wallpaper. Raise panel opacity if text becomes hard to read.

## 1.0.3

- Removed the extra light glass card, border, shadow, and duplicate blur that the sidebars had drawn. They now sit directly on the window's Acrylic layer.
- Kept the active-item indicator.
- Panel and settings-window rules unchanged.

## 1.0.2

- Fixed the settings window title bar for Obsidian 1.13's separate settings window.
- The window background, title bar, and settings page are now a single solid color, and the native close icon is restored.
- Found by reading `app.css` from the running Obsidian build (1.13.7) rather than the installer (1.12.7) — the pop-out window uses `body.is-popout-modal > .modal` with its own `.titlebar`, which the earlier fixture did not model.
- The companion plugin was not modified in this release.

## 1.0.1

- Removed the decorative corner shapes at the bottom of tabs.
- Fixed a class-observation loop that fired on theme switches, and coalesced repeated update events into one.
- Changed the plugin from running immediately to debouncing updates by 160 ms.
- The plugin now cancels pending timers and disconnects its observer on unload.

## 1.0.0

- Initial release. A derived theme built on ClaudeBaseline 1.0.0: the full base stylesheet, fonts, and note styles are preserved, with a glass material layer appended.
