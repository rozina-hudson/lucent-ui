import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'color-picker',
  name: 'ColorPicker',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A color swatch button that opens a popover with preset swatches and HEX / RGB / RGBA / HSL inputs.',

  designIntent:
    'ColorPicker surfaces color selection without navigating away. The swatch button shows the ' +
    'current color at a glance; the popover provides precise input through four format modes. ' +
    'Presets accelerate common choices — provide a curated palette relevant to the product. ' +
    'Always pair with a visible label so the purpose of the picker is clear.',

  props: [
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled color value. Accepts hex (#rrggbb / #rrggbbaa), rgb(), rgba(), or hsl() strings.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the new hex string (#rrggbb, or #rrggbbaa when alpha < 1) whenever the color changes.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered above the swatch button.',
    },
    {
      name: 'presets',
      type: 'string[]',
      required: false,
      description: 'Array of hex color strings shown as clickable swatches. Defaults to a 16-color palette.',
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      default: '"md"',
      description: 'Swatch trigger size. "sm" renders a 24px swatch, "md" renders 40px.',
    },
    {
      name: 'inline',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Places the label beside the swatch instead of above it. Useful for compact layouts.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction and dims the label.',
    },
    {
      name: 'portalContainer',
      type: 'HTMLElement | null',
      required: false,
      description:
        'DOM element to portal the popover into. Defaults to document.body. ' +
        'Set this to a wrapper element to preserve CSS custom property inheritance for per-section theming.',
    },
    {
      name: 'id',
      type: 'string',
      required: false,
      description: 'HTML id for the swatch button. Auto-generated if omitted.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      required: false,
      description: 'Inline styles applied to the outer wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic controlled',
      code: `const [color, setColor] = useState('#3b82f6');
<ColorPicker value={color} onChange={setColor} label="Brand color" />`,
    },
    {
      title: 'Custom presets',
      code: `<ColorPicker
  value={accent}
  onChange={setAccent}
  label="Accent"
  presets={['#111827', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#22c55e']}
/>`,
    },
    {
      title: 'No presets',
      code: `<ColorPicker value={color} onChange={setColor} presets={[]} label="Custom color" />`,
    },
    {
      title: 'Disabled',
      code: `<ColorPicker value="#6b7280" disabled label="Theme color" />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'button (trigger) + dialog (popover)',
    ariaAttributes: ['aria-expanded', 'aria-haspopup', 'aria-label'],
    keyboardInteractions: [
      'Enter / Space — opens the color picker popover',
      'Escape / click outside — closes the popover',
      'Tab — moves through format tabs and input fields within the popover',
    ],
  },
};
