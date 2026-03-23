import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'split-button',
  name: 'SplitButton',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A compound button pairing a primary action with a chevron dropdown for secondary actions.',
  designIntent:
    'Use SplitButton when there is one dominant action alongside a small set of related alternatives ' +
    '(e.g. "Save" + "Save as draft", "Deploy" + "Deploy to staging"). ' +
    'Each half is a fully independent button separated by a small token-based gap, with a subtle ' +
    'inner corner radius (radius-sm) so the pair reads as a unit without sharing a border. ' +
    'Hover lift and press ring apply independently per half. ' +
    'Ghost variants use tighter inner padding to keep the halves visually close. ' +
    'The chevron half opens a Menu molecule; all dropdown keyboard navigation is inherited.',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Label content for the primary action button.' },
    { name: 'onClick', type: 'function', required: true, description: 'Handler fired when the primary (left) half is clicked.' },
    { name: 'menuItems', type: 'array', required: true, description: 'Array of { label, onSelect, disabled?, danger?, icon? } for the dropdown.' },
    { name: 'variant', type: 'enum', required: false, default: 'primary', description: 'Visual variant applied to both halves.', enumValues: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'danger-outline', 'danger-ghost'] },
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Size applied to both halves.', enumValues: ['2xs', 'xs', 'sm', 'md', 'lg'] },
    { name: 'bordered', type: 'boolean', required: false, default: 'true', description: 'If false, removes the border on both halves.' },
    { name: 'menuPlacement', type: 'enum', required: false, default: 'bottom-end', description: 'Dropdown placement relative to the chevron trigger.', enumValues: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'] },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables both halves.' },
    { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Shows a spinner in the primary half and disables both.' },
    { name: 'leftIcon', type: 'ReactNode', required: false, description: 'Icon rendered before the label in the primary half.' },
    { name: 'style', type: 'object', required: false, description: 'Style overrides for the wrapper div.' },
  ],
  usageExamples: [
    {
      title: 'Basic',
      code: `<SplitButton onClick={handleSave} menuItems={[{ label: 'Save as draft', onSelect: handleDraft }]}>Save</SplitButton>`,
    },
    {
      title: 'Outline with leftIcon',
      code: `<SplitButton variant="outline" leftIcon={<Icon name="deploy" />} onClick={deploy} menuItems={[{ label: 'Deploy to staging', onSelect: deployStaging }, { label: 'Rollback', onSelect: rollback, danger: true }]}>Deploy</SplitButton>`,
    },
    {
      title: 'Menu items with icons',
      code: `<SplitButton onClick={handleSave} menuItems={[{ label: 'Save as draft', onSelect: handleDraft, icon: <Icon name="file" /> }, { label: 'Export', onSelect: handleExport, icon: <Icon name="download" /> }]}>Save</SplitButton>`,
    },
    {
      title: 'Small ghost bordered (issue #90 use case)',
      code: `<SplitButton variant="ghost" size="2xs" bordered onClick={toggle} menuItems={[{ label: 'Reset layout', onSelect: reset }]}>Collapse all</SplitButton>`,
    },
    {
      title: 'Danger outline with disabled item',
      code: `<SplitButton variant="danger-outline" onClick={handleDelete} menuItems={[{ label: 'Move to trash', onSelect: trash }, { label: 'Delete forever', onSelect: nuke, danger: true }, { label: 'Archive (unavailable)', onSelect: archive, disabled: true }]}>Delete</SplitButton>`,
    },
    {
      title: 'Disabled',
      code: `<SplitButton disabled onClick={handleSave} menuItems={[{ label: 'Option', onSelect: fn }]}>Save</SplitButton>`,
    },
    {
      title: 'Loading',
      code: `<SplitButton loading onClick={handleSave} menuItems={[{ label: 'Option', onSelect: fn }]}>Saving...</SplitButton>`,
    },
  ],
  compositionGraph: [
    { componentId: 'menu', componentName: 'Menu', role: 'Dropdown container for secondary actions', required: true },
    { componentId: 'menu-item', componentName: 'MenuItem', role: 'Individual dropdown action', required: true },
  ],
  accessibility: {
    role: 'group',
    ariaAttributes: ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-busy'],
    keyboardInteractions: [
      'Enter/Space on primary button fires onClick',
      'Enter/Space/ArrowDown on chevron opens dropdown',
      'ArrowDown/ArrowUp cycles dropdown items',
      'Home/End jumps to first/last item',
      'Escape closes dropdown and returns focus to chevron',
      'Tab closes dropdown',
    ],
    notes: 'The wrapper uses role="group" with aria-label derived from children. The chevron button carries aria-haspopup="menu" and aria-expanded via Menu. Primary button has aria-busy when loading.',
  },
};
