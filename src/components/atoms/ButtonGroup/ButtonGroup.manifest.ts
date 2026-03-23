import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'button-group',
  name: 'ButtonGroup',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A layout wrapper that visually groups multiple Button or SplitButton children into a related strip.',
  designIntent:
    'Use ButtonGroup for peer actions that belong together visually — toolbars, action bars, ' +
    'toggle groups. Unlike SegmentedControl (single-select with indicator), ButtonGroup has no ' +
    'built-in selection state; each child handles its own behaviour. ' +
    'Items are separated by a small token-based gap with subtle inner corner radius ' +
    'so the group reads as a unit while each button retains its own border and hover states.',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Button or SplitButton elements to group.' },
    { name: 'style', type: 'object', required: false, description: 'Style overrides for the wrapper div.' },
  ],
  usageExamples: [
    {
      title: 'Toolbar',
      code: `<ButtonGroup>\n  <Button variant="outline" leftIcon={<Icon name="bold" />} />\n  <Button variant="outline" leftIcon={<Icon name="italic" />} />\n  <Button variant="outline" leftIcon={<Icon name="underline" />} />\n</ButtonGroup>`,
    },
    {
      title: 'Action pair',
      code: `<ButtonGroup>\n  <Button variant="primary">Save</Button>\n  <Button variant="outline">Cancel</Button>\n</ButtonGroup>`,
    },
    {
      title: 'With SplitButton',
      code: `<ButtonGroup>\n  <SplitButton onClick={deploy} menuItems={[{ label: 'Staging', onSelect: staging }]}>Deploy</SplitButton>\n  <Button variant="outline">Logs</Button>\n</ButtonGroup>`,
    },
  ],
  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'Grouped action item', required: false },
    { componentId: 'split-button', componentName: 'SplitButton', role: 'Grouped split action item', required: false },
  ],
  accessibility: {
    role: 'group',
    ariaAttributes: [],
    keyboardInteractions: [
      'Tab moves focus between buttons in the group',
    ],
    notes: 'Uses role="group" on the wrapper. Individual button accessibility is inherited from the children.',
  },
};
