/**
 * The tier of a component in the design system hierarchy.
 *
 * - atom:     Indivisible UI primitive (Button, Input, Badge…)
 * - molecule: Composition of atoms (FormField, Card, Alert…)
 * - block:    Page-section-level composition (PageHeader, SidebarNav…)
 * - flow:     Multi-step or stateful sequences (Wizard, Onboarding…)
 * - overlay:  Layers above page content (Modal, Drawer, Tooltip…)
 * - provider: Root configuration wrapper (LucentProvider…)
 */
export type ComponentTier = 'atom' | 'molecule' | 'block' | 'flow' | 'overlay' | 'provider';

/**
 * The domain of a component.
 * "neutral" means the component is domain-agnostic and reusable
 * across any product context.
 */
export type ComponentDomain = 'neutral' | string;

// ─── Prop descriptor ────────────────────────────────────────────────────────

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'ReactNode'
  | 'function'
  | 'enum'
  | 'object'
  | 'array'
  | 'ref'
  | string; // allow custom type strings like "ButtonVariant"

export interface PropDescriptor {
  /** Prop name as it appears in the component API */
  name: string;
  /** TypeScript type or custom type name */
  type: PropType;
  /** Whether the prop is required */
  required: boolean;
  /** Default value as a string representation */
  default?: string;
  /** Human-readable description for AI and documentation */
  description: string;
  /** For enum types — the allowed values */
  enumValues?: readonly string[];
}

// ─── Usage example ──────────────────────────────────────────────────────────

export interface UsageExample {
  /** Short label for the example */
  title: string;
  /** JSX or TSX code string */
  code: string;
  /** Optional description of what this example demonstrates */
  description?: string;
}

// ─── Composition graph ──────────────────────────────────────────────────────

export interface CompositionNode {
  /** Component id this node refers to */
  componentId: string;
  /** Human-readable name */
  componentName: string;
  /** How it is used in the composition */
  role: string;
  /** Whether this sub-component is always present or conditional */
  required: boolean;
}

// ─── Accessibility ──────────────────────────────────────────────────────────

export interface AccessibilityDescriptor {
  /** ARIA role applied to the root element */
  role?: string;
  /** ARIA attributes used by this component */
  ariaAttributes?: string[];
  /** Keyboard interactions supported */
  keyboardInteractions?: string[];
  /** Plain-English notes for screen reader behaviour */
  notes?: string;
}

// ─── Composition recipe ─────────────────────────────────────────────────────

export type RecipeCategory = 'card' | 'form' | 'nav' | 'dashboard' | 'settings' | 'action';

/**
 * A composition recipe describes how multiple components compose into a
 * real UI pattern.  Recipes bridge the gap between individual component
 * manifests and production-quality layouts — an AI agent can use the
 * structure tree, working code, and design notes to produce correct
 * multi-component compositions on the first try.
 */
export interface CompositionRecipe {
  /** Unique kebab-case identifier, e.g. "profile-card" */
  id: string;
  /** Human-readable name, e.g. "Profile Card" */
  name: string;
  /** One-line AI-optimised summary of what this recipe builds */
  description: string;
  /** Broad UI category for filtering */
  category: RecipeCategory;
  /** Component IDs used in the recipe (from ComponentManifest.id) */
  components: readonly string[];
  /** ASCII / indented tree showing layout hierarchy */
  structure: string;
  /** Full working JSX example */
  code: string;
  /** Optional named variants */
  variants?: readonly {
    title: string;
    code: string;
  }[];
  /** Why this arrangement works — spacing rationale, hierarchy reasoning */
  designNotes: string;
}

// ─── Main manifest interface ─────────────────────────────────────────────────

export interface ComponentManifest {
  /**
   * Unique identifier — kebab-case, e.g. "button", "form-field"
   */
  id: string;

  /** Display name shown in docs and tooling */
  name: string;

  /** Position in the design system hierarchy */
  tier: ComponentTier;

  /**
   * Product domain this component belongs to.
   * Use "neutral" for general-purpose components.
   */
  domain: ComponentDomain;

  /** One-sentence description for AI context */
  description: string;

  /** All accepted props */
  props: readonly PropDescriptor[];

  /** Code examples an AI can use to generate correct usage */
  usageExamples: readonly UsageExample[];

  /**
   * For molecules, blocks, flows and overlays — the sub-components
   * this component is composed from.
   */
  compositionGraph: readonly CompositionNode[];

  /**
   * Design intent: explain the "why" behind visual and interaction decisions.
   * This is the key field for AI-legibility — it conveys context that
   * prop types alone cannot.
   */
  designIntent: string;

  /** Accessibility metadata */
  accessibility?: AccessibilityDescriptor;

  /**
   * Spec version this manifest conforms to.
   * Format: "MAJOR.MINOR" — e.g. "0.1"
   */
  specVersion: string;
}
