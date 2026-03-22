import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'toast',
  name: 'Toast',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Ephemeral notification system with auto-dismiss, cascading card-stack, ' +
    'hover-to-expand, action buttons/links, and animated enter/exit transitions. ' +
    'Comprises ToastProvider (context + portal), useToast hook, and toast card rendering.',

  designIntent:
    'Toast provides ephemeral feedback for actions that don\'t require the user to navigate away or ' +
    'acknowledge inline. It fills the gap between Alert (persistent, inline) and Modal (blocking). ' +
    '\n\n' +
    '**Architecture**: ToastProvider wraps the app and manages a queue of toast entries. It renders ' +
    'toasts into a React portal (document.body by default, configurable via portalContainer) so they ' +
    'float above all page content regardless of stacking contexts. The useToast() hook exposes an ' +
    'imperative `toast()` function that returns a dismissible id, and a `dismiss()` function. ' +
    '\n\n' +
    '**Positioning**: The viewport is fixed-positioned with a stable anchor edge. For bottom positions, ' +
    'the toast\'s top edge is pinned 120px from the viewport bottom (ANCHOR_INSET_BOTTOM), so taller ' +
    'toasts extend downward toward the screen edge — the top never jumps. For top positions, the top ' +
    'edge is pinned 40px from the viewport top (ANCHOR_INSET), keeping toasts close to the top bar ' +
    'or header area. Both distances are separate constants to allow independent tuning. Six positions ' +
    'are supported: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right. ' +
    '\n\n' +
    '**Cascading stack**: When multiple toasts are active, only the newest (front) toast shows its full ' +
    'content. Older toasts render as empty card shells (border + background, no content) that peek ' +
    'behind the front toast with progressive scaleX reduction and opacity fade. Each shell is ' +
    'height-matched to the front toast via measurement so the peek gaps are perfectly uniform. ' +
    'Up to 3 stacked shells are visible behind the front toast. ' +
    '\n\n' +
    '**Hover to expand**: Hovering the stack smoothly expands all toasts into a full vertical list ' +
    'with content fading in, card heights animating to natural size, and shadows appearing. The ' +
    'expanded stack uses flex column-reverse for bottom positions so older toasts fan upward into ' +
    'the viewport. A 150ms debounced collapse timer prevents flicker when the cursor moves between ' +
    'toasts in the expanded list. ' +
    '\n\n' +
    '**Enter/exit animations**: New toasts slide in from the screen edge with opacity fade and slight ' +
    'scale-up (requestAnimationFrame double-raf triggers the CSS transition). Dismissed toasts slide ' +
    'back toward the edge and fade out over 200ms. ' +
    '\n\n' +
    '**Auto-dismiss**: Each toast auto-dismisses after a configurable duration (default 5s). Pass ' +
    'Infinity to disable. The timer is managed per-toast via useEffect, so each toast dismisses ' +
    'independently. ' +
    '\n\n' +
    '**Actions**: Toasts support an inline action rendered as either a bordered button (default, ' +
    'matching the Undo pattern from Sonner/Google) or an underlined link. Clicking the action fires ' +
    'the callback and auto-dismisses the toast. ' +
    '\n\n' +
    '**Variants**: default (neutral border), success, warning, danger, info — matching Alert\'s ' +
    'semantic token usage. Each variant sets border color and icon color from status tokens. ' +
    'Non-default variants include a built-in 16×16 SVG icon (same as Alert). ' +
    '\n\n' +
    '**Multi-line text**: title is always shown (semibold). Optional description supports newlines ' +
    'via white-space: pre-line. All text uses the Text atom.',

  props: [
    // ─── ToastProvider props ──────────────────────────────────────────
    {
      name: 'position',
      type: 'enum',
      required: false,
      default: 'bottom-right',
      description: 'Screen edge and alignment where the toast stack appears.',
      enumValues: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      default: '5000',
      description: 'Default auto-dismiss duration in milliseconds. Applies to all toasts unless overridden per-toast.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      default: '5',
      description: 'Maximum number of toasts in the queue. When exceeded, the oldest toast is dismissed with an exit animation.',
    },
    {
      name: 'portalContainer',
      type: 'object',
      required: false,
      description: 'DOM element to render the toast portal into. Defaults to document.body. Useful for scoping toasts to a specific container (e.g. inside an iframe or shadow DOM).',
    },
    // ─── ToastOptions (per-toast, passed to toast()) ─────────────────
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Primary message line, rendered in semibold. Always visible.',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Secondary description text below the title. Supports multi-line via newline characters (\\n). Rendered in secondary color.',
    },
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'default',
      description: 'Visual variant controlling border color, icon, and icon color. Matches Alert\'s semantic status tokens.',
      enumValues: ['default', 'success', 'warning', 'danger', 'info'],
    },
    {
      name: 'duration (per-toast)',
      type: 'number',
      required: false,
      default: '5000',
      description: 'Override the provider-level auto-dismiss duration for this specific toast. Pass Infinity to disable auto-dismiss.',
    },
    {
      name: 'action',
      type: 'object',
      required: false,
      description: 'Inline action rendered beside the dismiss button. Object with { label: string, onClick: () => void, style?: "button" | "link" }. Button style renders a bordered pill button (default). Link style renders an underlined text link. Clicking fires onClick and auto-dismisses the toast.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      description: 'Custom icon to replace the built-in variant icon. Only used when variant is not "default". Pass null to suppress the icon entirely.',
    },
  ],

  usageExamples: [
    {
      title: 'Provider setup',
      description: 'Wrap your app with ToastProvider inside LucentProvider. Position and duration are configurable at the provider level.',
      code: `<LucentProvider>
  <ToastProvider position="bottom-right" duration={5000}>
    <App />
  </ToastProvider>
</LucentProvider>`,
    },
    {
      title: 'Basic toast',
      description: 'Minimal toast with just a title. Uses the default variant (neutral border, no icon).',
      code: `const { toast } = useToast();
toast({ title: 'Changes saved' });`,
    },
    {
      title: 'Success with description',
      description: 'Two-line toast with a success variant. The description supports newlines via \\n.',
      code: `toast({
  title: 'Order placed!',
  description: 'You\\'ll receive a confirmation email shortly.',
  variant: 'success',
});`,
    },
    {
      title: 'Danger with undo button',
      description: 'Destructive action feedback with an inline undo button. Clicking the action auto-dismisses.',
      code: `toast({
  title: 'Message deleted',
  variant: 'danger',
  action: {
    label: 'Undo',
    onClick: () => restoreMessage(id),
  },
});`,
    },
    {
      title: 'Action as link',
      description: 'Action rendered as an underlined link instead of a bordered button.',
      code: `toast({
  title: 'Event created',
  description: 'Sunday, December 03, 2023 at 9:00 AM',
  action: {
    label: 'View',
    style: 'link',
    onClick: () => navigate('/events/123'),
  },
});`,
    },
    {
      title: 'Multi-line description',
      description: 'Description with embedded newlines rendered via white-space: pre-line.',
      code: `toast({
  title: 'Approaching limit',
  description: 'You have used 80% of your monthly quota.\\nConsider upgrading your plan.',
  variant: 'warning',
});`,
    },
    {
      title: 'Persistent (no auto-dismiss)',
      description: 'Pass Infinity as duration to keep the toast visible until manually dismissed.',
      code: `toast({
  title: 'Upload in progress',
  description: 'Please do not close this tab.',
  duration: Infinity,
});`,
    },
    {
      title: 'Programmatic dismiss',
      description: 'toast() returns an id that can be passed to dismiss() to remove it programmatically.',
      code: `const { toast, dismiss } = useToast();
const id = toast({ title: 'Processing...', duration: Infinity });
// Later:
dismiss(id);`,
    },
    {
      title: 'Custom icon',
      description: 'Override the built-in variant icon with a custom SVG.',
      code: `toast({
  title: 'Synced',
  variant: 'success',
  icon: <CloudSyncIcon />,
});`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Renders title and description text with correct typography', required: true },
    { componentId: 'icon', componentName: 'Icon (built-in SVGs)', role: 'Status variant icons (info, success, warning, danger)', required: false },
  ],

  accessibility: {
    role: 'status',
    ariaAttributes: ['aria-live', 'aria-hidden', 'aria-label'],
    keyboardInteractions: [
      'Tab: focuses the dismiss button and action button within the toast',
      'Enter/Space: activates the focused dismiss or action button',
      'Escape: no default behavior (consider adding dismiss-on-escape if needed)',
    ],
    notes:
      'Each toast uses role="status" with aria-live="polite" so screen readers announce the content ' +
      'without interrupting the current task. This is appropriate for non-urgent status messages like ' +
      '"Changes saved" or "Profile updated". For truly urgent errors that must interrupt the user, ' +
      'consider wrapping the ToastProvider output in a role="alert" region or using the Alert component ' +
      'instead. The dismiss button carries aria-label="Dismiss" for screen reader clarity. Stacked ' +
      'toasts behind the front toast are marked aria-hidden="true" to prevent screen readers from ' +
      'announcing duplicate or hidden content. When the stack expands on hover, aria-hidden is removed ' +
      'so all toasts become accessible.',
  },
};
