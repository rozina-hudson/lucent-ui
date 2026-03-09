---
"lucent-ui": minor
---

Add ColorSwatch, SegmentedControl, ColorPicker atoms; enhance Input and Select

**New atoms**
- `ColorSwatch` — circular or square swatch with sizes (xs–2xl), selected state, checkerboard alpha support, and full button attribute forwarding
- `SegmentedControl` — sliding active indicator, fullWidth default, sm/md/lg sizes
- `ColorPicker` — spectrum panel, hue/alpha sliders, Hex/RGB/HSL/HSB format tabs, multi-group preset palettes, eyedropper support

**Breaking changes**
- `ColorPicker`: `presets`/`presetsLabel` props replaced by `presetGroups: ColorPresetGroup[]`

**Enhancements**
- `Input`: new `size` prop (sm/md/lg), `prefix`/`suffix` addons, `leftElement`/`rightElement` icon slots
- `Select`: `style` prop now applies to the outer wrapper div (consistent with `Input`)
