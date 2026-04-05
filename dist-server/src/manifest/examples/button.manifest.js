export const ButtonManifest = {
    id: 'button',
    name: 'Button',
    tier: 'atom',
    domain: 'neutral',
    specVersion: '1.0',
    description: 'A clickable control that triggers an action. The primary interactive primitive in Lucent UI.',
    designIntent: 'Buttons communicate available actions. Variant conveys hierarchy: use "primary" for the ' +
        'single most important action in a view, "secondary" for supporting actions, "ghost" for ' +
        'low-emphasis actions in dense UIs, "outline" for bordered buttons with transparent background, and "danger" exclusively for destructive or irreversible ' +
        'operations. Use "danger-ghost" for low-emphasis destructive actions (red text, no fill) and ' +
        '"danger-outline" for bordered destructive buttons (also transparent background). Size should match surrounding content density — prefer "md" as the default, ' +
        '"sm" for toolbars or tables, "xs" for compact UIs like customizer panels, and "2xs" for ' +
        'ultra-dense inline controls (~22px height) such as table-inline actions or toolbar icon triggers. ' +
        'Icon-only buttons (leftIcon/rightIcon without children) automatically render as square with aspect-ratio: 1.',
    props: [
        {
            name: 'variant',
            type: 'enum',
            required: false,
            default: 'primary',
            description: 'Visual style conveying action hierarchy. ' +
                '"primary" — filled accent for the single most important action. ' +
                '"secondary" — subtle accent-tinted fill for supporting actions. ' +
                '"outline" — bordered with no fill, for neutral secondary actions. ' +
                '"ghost" — transparent with no border, for low-emphasis or inline actions. ' +
                '"danger" — filled red for irreversible destructive actions (e.g. "Delete account"). ' +
                '"danger-outline" — red border + red text for destructive actions that need visual weight without a filled background. ' +
                '"danger-ghost" — red text only, for low-emphasis destructive actions (e.g. "Remove" in a list row).',
            enumValues: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'danger-outline', 'danger-ghost'],
        },
        {
            name: 'size',
            type: 'enum',
            required: false,
            default: 'md',
            description: 'Controls height and padding. ' +
                '"lg" (48px) — hero sections, onboarding flows. ' +
                '"md" (42px) — default for most forms and dialogs. ' +
                '"sm" (34px) — toolbars, table headers, card actions. ' +
                '"xs" (26px) — compact UIs like customizer panels, inline controls. ' +
                '"2xs" (22px) — ultra-dense inline icon triggers, table-row actions, dashboard toolbar buttons.',
            enumValues: ['2xs', 'xs', 'sm', 'md', 'lg'],
        },
        {
            name: 'children',
            type: 'ReactNode',
            required: false,
            description: 'Button label or content. Omit for icon-only buttons (provide leftIcon or rightIcon instead).',
        },
        {
            name: 'disabled',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Prevents interaction and applies disabled styling.',
        },
        {
            name: 'loading',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Shows a spinner and prevents interaction while an async action is in progress.',
        },
        {
            name: 'fullWidth',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Stretches the button to fill its container width.',
        },
        {
            name: 'bordered',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'When false removes the button border entirely, producing a flat look.',
        },
        {
            name: 'leftIcon',
            type: 'ReactNode',
            required: false,
            description: 'Icon element rendered before the label.',
        },
        {
            name: 'rightIcon',
            type: 'ReactNode',
            required: false,
            description: 'Icon element rendered after the label.',
        },
        {
            name: 'chevron',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Appends a chevron-down icon after the label. Useful for dropdown triggers.',
        },
        {
            name: 'spread',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Spaces content to the edges (justify-content: space-between). Useful with fullWidth + rightIcon/chevron.',
        },
        {
            name: 'onClick',
            type: 'function',
            required: false,
            description: 'Called when the button is clicked and not disabled or loading.',
        },
        {
            name: 'type',
            type: 'enum',
            required: false,
            default: 'button',
            description: 'Native button type attribute. Ignored when `href` is set.',
            enumValues: ['button', 'submit', 'reset'],
        },
        {
            name: 'href',
            type: 'string',
            required: false,
            description: 'When set, renders the Button as an `<a href={href}>` instead of a native `<button>`. ' +
                'Preserves native anchor affordances (middle-click, cmd/ctrl-click, right-click "copy link address", ' +
                'open in new tab) that an onClick handler cannot. ' +
                'Use for `mailto:` / `tel:` quick actions, external links styled as buttons, ' +
                'or in-app routes where users legitimately expect anchor semantics. ' +
                'When combined with `disabled`, the anchor renders with `aria-disabled="true"` and its `href` is stripped so navigation is neutralised.',
        },
        {
            name: 'target',
            type: 'string',
            required: false,
            description: 'Forwarded to the rendered `<a>` when `href` is set (e.g. `"_blank"` to open in a new tab). Ignored when rendering as a button.',
        },
        {
            name: 'rel',
            type: 'string',
            required: false,
            description: 'Forwarded to the rendered `<a>` when `href` is set (e.g. `"noopener noreferrer"` for external links). Ignored when rendering as a button.',
        },
    ],
    usageExamples: [
        {
            title: 'Primary action',
            code: `<Button variant="primary" onClick={handleSave}>Save changes</Button>`,
        },
        {
            title: 'Destructive action',
            code: `<Button variant="danger" onClick={handleDelete}>Delete account</Button>`,
        },
        {
            title: 'Loading state',
            code: `<Button variant="primary" loading={isSaving}>Save changes</Button>`,
        },
        {
            title: 'With icon',
            code: `<Button variant="secondary" leftIcon={<PlusIcon />}>Add member</Button>`,
        },
        {
            title: 'Ghost in toolbar',
            code: `<Button variant="ghost" size="sm">Edit</Button>`,
        },
        {
            title: 'Full-width submit',
            code: `<Button variant="primary" type="submit" fullWidth>Sign in</Button>`,
        },
        {
            title: 'Outline with swatch',
            code: `<Button size="xs" variant="outline" leftIcon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />}>Indigo</Button>`,
        },
        {
            title: 'Dropdown trigger',
            code: `<Button variant="outline" chevron>Options</Button>`,
        },
        {
            title: 'Bordered destructive action',
            code: `<Button variant="danger-outline" onClick={handleRevoke}>Revoke access</Button>`,
        },
        {
            title: 'Low-emphasis destructive action',
            code: `<Button variant="danger-ghost" onClick={handleRemove}>Remove</Button>`,
        },
        {
            title: 'Dense inline action',
            code: `<Button variant="ghost" size="2xs" leftIcon={<RefreshIcon />}>Retry</Button>`,
        },
        {
            title: 'Icon-only (square)',
            code: `<Button variant="outline" size="2xs" leftIcon={<CloseIcon />} aria-label="Close" />`,
            description: 'Omitting children auto-sizes the button as a square via aspect-ratio: 1.',
        },
        {
            title: 'Mailto quick action',
            code: `<Button variant="ghost" size="sm" href="mailto:foo@example.com" leftIcon={<MailIcon />} aria-label="Email" />`,
            description: 'Renders as <a href="mailto:..."> so middle-click, cmd/ctrl-click, and right-click "copy link" all work.',
        },
        {
            title: 'External link as button',
            code: `<Button variant="primary" href="https://example.com" target="_blank" rel="noopener noreferrer" rightIcon={<ExternalIcon />}>View docs</Button>`,
            description: 'Use href + target + rel for external links that should look like a primary call-to-action.',
        },
        {
            title: 'Disabled link',
            code: `<Button variant="outline" href="/settings" disabled>Settings</Button>`,
            description: 'When disabled, the anchor is rendered with aria-disabled="true" and its href is stripped.',
        },
    ],
    compositionGraph: [],
    accessibility: {
        role: 'button',
        ariaAttributes: ['aria-disabled', 'aria-busy'],
        keyboardInteractions: ['Enter — activates the button', 'Space — activates the button'],
    },
};
