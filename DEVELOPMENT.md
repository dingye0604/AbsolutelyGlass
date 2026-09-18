# Development

## How the theme is built

`theme.css` — the file Obsidian actually loads — is a build artifact. It is two files concatenated:

```
AbsolutelyBaseline/theme.css  +  "\n\n"  +  glass.css   →   theme.css
```

`build.ps1` does the concatenation byte-for-byte.

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

The consequence worth knowing: **`AbsolutelyBaseline/theme.css` is a byte prefix of `theme.css`.** Change the base and you change this theme too; rebuild or the two drift apart silently. `verify.cjs` asserts the prefix holds.

Never edit `theme.css` by hand — the next build overwrites it.

| File | Role |
|---|---|
| `glass.css` | The only hand-written CSS in this repo |
| `build.ps1` | Concatenates the base and the overlay |
| `theme.css` | Build output. Do not edit. |
| `verify.cjs` | Automated checks (see below) |
| `VALIDATION.md` | Record of what has and has not been verified |

## Interface with the companion plugin

Three names are a contract between this theme and `absolutely-glass-acrylic`. Changing either side without the other breaks the plugin silently, and `verify.cjs` will fail.

| Name | Defined in | Read by |
|---|---|---|
| `--claudeapple-theme: 1` | `glass.css` | The plugin's `sync()`. Anything other than `1` and it restores the window. |
| `body.ca-native-glass` | Added by the plugin | `glass.css`, which makes the html background transparent |
| `body.ca-solid` | `glass.css` (Style Settings toggle) | The plugin, which skips Acrylic when it is set |

## Verification

```powershell
node --check .\main.js   # the companion plugin
node .\verify.cjs <playwright-node_modules> <output-dir> <obsidian.asar>
```

Run `verify.cjs` **from inside an installed vault** (`.obsidian/themes/AbsolutelyGlass/`). It resolves `../AbsolutelyBaseline/theme.css` and `../../plugins/absolutely-glass-acrylic/main.js` relative to itself, so those paths only exist in a vault layout.

What it covers:

- Seven plugin lifecycle cases: theme switch, unload, solid mode, Acrylic API failure, pre-22H2 Windows, non-Windows, reduced-transparency preference
- Computed-style assertions on a dark and light browser fixture
- The separate settings window (Obsidian 1.13+)
- A MutationObserver regression that reproduces the old notification loop against a real DOM

What it does **not** cover: Windows DWM composition, actual desktop-through transparency, focus changes, maximizing, multiple monitors, mobile, or PDF export. Browser fixture screenshots are not screenshots of the running app. See `VALIDATION.md` for the honest boundary.

## Verification rules

`VALIDATION.md` separates **what was done** from **what was not verified**, per version. Keep it that way:

- Only commands actually run and numbers actually observed.
- A browser fixture is not the real app. Never write it up as if it were.
- Mocked Electron APIs must be labelled as mocked.
- Write "not verified" rather than "should work".

## Packaging for release

The community directory reads `manifest.json` from the repository root and pulls `manifest.json` + `theme.css` from the GitHub release whose tag matches the manifest `version`. The tag must be the bare version (`1.0.4`, not `v1.0.4`).
