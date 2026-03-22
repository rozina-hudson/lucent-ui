import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'chip',
  name: 'Chip',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A compact label for filters, tags, statuses, and categories. Combines the roles of Badge and Tag into a single flexible component.',

  designIntent:
    'Chip is the universal label primitive — use it anywhere you need a compact visual marker. ' +
    'It replaces both Badge (static status) and Tag (dismissible filter) with a single component. ' +
    'Use `onDismiss` for removable chips (filters, multi-select values). ' +
    'Use `onClick` for clickable/selectable chips (filter toggles, category navigation). ' +
    'Use `dot` for status indicators (online/offline). ' +
    'Use `dot` + `pulse` to show in-progress or live states (deploying, syncing, live incident). ' +
    'Use `ghost` + `dot` for subtle inline status that blends into surrounding text or table rows. ' +
    'Omit `children` with `dot` for a minimal dot-only indicator — great for table cells or avatar badges. ' +
    'Use `swatch` for color-coded categories. ' +
    'Use `leftIcon` for chips with leading icons (folders, file types, flags). ' +
    'Use `borderless` for a softer, filled-only appearance in dense UIs. ' +
    'Variant conveys semantic meaning — default to neutral for user-generated content.',

  props: [
    { name: 'children', type: 'ReactNode', required: false, description: 'Chip label content. When omitted with dot=true, renders as a compact dot-only indicator.' },
    { name: 'variant', type: 'enum', required: false, default: 'neutral', description: 'Colour scheme conveying semantic meaning.', enumValues: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] },
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Controls height, font size, and icon size.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'onDismiss', type: 'function', required: false, description: 'Renders an x button that calls this handler. Use for removable filters and multi-select values.' },
    { name: 'onClick', type: 'function', required: false, description: 'Makes the chip clickable (renders as <button>). Use for filter toggles and category links.' },
    { name: 'leftIcon', type: 'ReactNode', required: false, description: 'Icon or element rendered before the label (emoji, flag, avatar).' },
    { name: 'swatch', type: 'string', required: false, description: 'Hex color string. Renders a small color dot before the label.' },
    { name: 'dot', type: 'boolean', required: false, default: 'false', description: 'Renders a status dot using the variant colour. Omit children for a compact dot-only indicator.' },
    { name: 'pulse', type: 'boolean', required: false, default: 'false', description: 'Adds a pulsing ring animation to the status dot. Only applies when dot=true. Use for running, deploying, or live states.' },
    { name: 'borderless', type: 'boolean', required: false, default: 'false', description: 'Removes the border for a filled-only look.' },
    { name: 'ghost', type: 'boolean', required: false, default: 'false', description: 'Transparent background with text color only. Pairs well with dot for subtle inline statuses in tables or lists.' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Dims the chip and prevents interaction.' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides.' },
  ],

  usageExamples: [
    // Status indicators — subtle ways to show state
    { title: 'Status dot', code: `<Chip variant="success" dot>Online</Chip>` },
    { title: 'Pulsing status (in-progress)', code: `<Chip variant="warning" dot pulse>Deploying</Chip>` },
    { title: 'Ghost status (inline/table)', code: `<Chip variant="success" ghost dot>Active</Chip>` },
    { title: 'Ghost pulsing', code: `<Chip variant="danger" ghost dot pulse>Live incident</Chip>` },
    { title: 'Dot only (minimal)', code: `<Chip variant="success" dot />` },
    { title: 'Dot only pulsing', code: `<Chip variant="danger" dot pulse />` },
    // Filters, tags, and categories
    { title: 'Dismissible filter', code: `<Chip onDismiss={() => removeFilter('react')}>React</Chip>` },
    { title: 'Color swatch', code: `<Chip swatch="#6366f1" onDismiss={() => {}}>Indigo</Chip>` },
    { title: 'With icon', code: `<Chip leftIcon={<FolderIcon />} onDismiss={() => {}}>Documents</Chip>` },
    { title: 'Clickable category', code: `<Chip variant="accent" onClick={() => navigate('/ux')}>UX</Chip>` },
    { title: 'Borderless', code: `<Chip variant="warning" borderless>Pending</Chip>` },
    { title: 'Static label', code: `<Chip variant="info">Beta</Chip>` },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'group',
    notes: 'When onClick is provided, renders as <button> with native button semantics. Dismiss button has aria-label="Dismiss" and stopPropagation to prevent parent click handlers.',
    keyboardInteractions: ['Enter / Space — activates onClick or dismiss button when focused'],
  },
};
