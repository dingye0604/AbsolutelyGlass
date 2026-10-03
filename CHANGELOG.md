# Changelog

## 1.0.11

- Link quote and fenced-code background opacity to panel opacity. Preserve light tints at zero and blend to opaque panel colours at one, including Live Preview line backgrounds. Inline code remains unchanged.

## 1.0.10

- Lower quote tint opacity to 16% and set reading-view blur to 110% of the shared panel radius (26.4 px), keeping the accent border and accessibility fallbacks.

## 1.0.9

- Give blockquotes a 78% opaque glass tint in reading and Live Preview modes. Add reading-view blur and subtle inset highlights; preserve solid and reduced-transparency fallbacks.

## 1.0.8

- Remove the panel blur slider. Keep CSS blur fixed at 24 px with accessibility fallbacks; saved values from the removed control no longer affect the material.

## 1.0.7

- Keep the vault switcher (`<>`) and native settings icon at the bottom of the left rail when the desktop sidebar is collapsed, inherited from AbsolutelyBaseline 1.0.1.

## 1.0.6

- Fix dark-mode document tab labels, icons, and close buttons to use white sidebar text across selection, hover, and focus states. Light mode retains near-black text.

## 1.0.5

- Keep document tab labels and icons near-black in every selection and focus state.
- Restore the connected Baseline tab shape and flush reading surface. Use one continuous clipped backdrop layer to avoid square seams at the reverse corners.
- Allow panel opacity from 0 to 1 and remove the independent editor sheen so zero clears the background. The selected tab shares the reading surface opacity, blur and saturation.
- Acrylic and CSS blur remain independent.

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

- Initial release. A derived theme built on AbsolutelyBaseline 1.0.0: the full base stylesheet, fonts, and note styles are preserved, with a glass material layer appended.
