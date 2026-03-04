import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'avatar',
  name: 'Avatar',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A circular user image with initials fallback.',
  designIntent:
    'Always provide alt for accessibility — it is used to derive initials automatically when src is absent or fails. ' +
    'Use initials prop to override auto-derived initials (e.g. for non-Latin names). ' +
    'Size xs/sm suit table rows and compact lists; md is the default for comment threads; lg/xl for profile headers.',
  props: [
    { name: 'src', type: 'string', required: false, description: 'Image URL. Falls back to initials if omitted or fails to load.' },
    { name: 'alt', type: 'string', required: true, description: 'Alt text and source for auto-derived initials.' },
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Diameter of the avatar.', enumValues: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { name: 'initials', type: 'string', required: false, description: 'Override auto-derived initials (max 2 characters).' },
  ],
  usageExamples: [
    { title: 'With image', code: `<Avatar src="/avatars/jane.jpg" alt="Jane Doe" />` },
    { title: 'Initials fallback', code: `<Avatar alt="Jane Doe" />` },
    { title: 'Large profile', code: `<Avatar src={user.avatar} alt={user.name} size="lg" />` },
    { title: 'Custom initials', code: `<Avatar alt="张伟" initials="张" size="md" />` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    notes: 'When src is present, renders as <img> with alt. When showing initials, renders as <span role="img" aria-label>.',
  },
};
