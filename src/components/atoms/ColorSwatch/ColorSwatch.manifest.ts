import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'color-swatch',
  name: 'ColorSwatch',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A circular color swatch that can be static or interactive.',

  designIntent:
    'ColorSwatch is the smallest unit of color representation in the system. ' +
    'Use it wherever a color needs to be shown at a glance — palette pickers, ' +
    'token lists, or inline color indicators. The selected state shows an ' +
    'accent-colored ring to indicate the active choice.',

  props: [
    { name: 'color', type: 'string', required: true, description: 'CSS color value to display.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Swatch diameter: sm=16px, md=22px, lg=28px.' },
    { name: 'selected', type: 'boolean', required: false, default: 'false', description: 'Shows an accent ring when true.' },
    { name: 'onClick', type: 'function', required: false, description: 'Click handler. Omit for a non-interactive display swatch.' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Dims the swatch and prevents interaction.' },
    { name: 'title', type: 'string', required: false, description: 'Tooltip text. Defaults to the color value.' },
    { name: 'style', type: 'CSSProperties', required: false, description: 'Inline styles applied to the swatch button.' },
  ],

  usageExamples: [
    {
      title: 'Static palette',
      code: `['#ef4444', '#f97316', '#22c55e'].map(c => (
  <ColorSwatch key={c} color={c} />
))`,
    },
    {
      title: 'Selectable swatch',
      code: `<ColorSwatch color="#3b82f6" selected={active === '#3b82f6'} onClick={() => setActive('#3b82f6')} />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'button',
    ariaAttributes: ['title (tooltip)'],
    keyboardInteractions: ['Enter / Space — triggers onClick'],
  },
};
