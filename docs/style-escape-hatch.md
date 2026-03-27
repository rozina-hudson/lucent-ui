# Style escape hatch

Every Lucent component accepts a `style` prop (`React.CSSProperties`). This is the official escape hatch for one-off styling that falls outside the token system.

## When to use it

Lucent's typed props (`color`, `size`, `weight`, etc.) map to semantic tokens that adapt across light/dark themes automatically. Prefer them when a matching prop exists.

Use `style` when you need:

- **A color outside the semantic set** — e.g. a chart label that must match a specific hex value, or a CSS variable from your own design system.
- **A layout tweak** — e.g. `maxWidth`, `gap`, or `marginTop` that only applies in one place.
- **An animation override** — e.g. a custom `transition` or `transform`.

## How it works

The `style` prop is spread **last** in every component, so it overrides any computed token styles:

```tsx
// Inside Text.tsx (simplified)
const computedStyle: CSSProperties = {
  fontSize:   sizeMap[size],
  fontWeight: weightMap[weight],
  color:      colorMap[color],   // ← semantic token
  ...style,                      // ← your override wins
};
```

This means `style={{ color: 'var(--my-green)' }}` replaces the semantic `color` while keeping `fontSize`, `fontWeight`, and everything else intact.

## Examples

### Custom text color

Text's `color` prop only accepts semantic values (`primary`, `secondary`, `danger`, etc.). For a one-off custom color, use `style`:

```tsx
// Use a CSS variable from your own token system
<Text style={{ color: 'var(--chart-series-a)' }}>Revenue</Text>

// Use a computed color
<Text style={{ color: ensureContrast(bgHex, fgHex) }}>Dynamic label</Text>

// Hard-coded hex (last resort — won't adapt to light/dark)
<Text style={{ color: '#16a34a' }}>Approved</Text>
```

### Card with a custom max-width

```tsx
<Card variant="elevated" style={{ maxWidth: 480 }}>
  <Text>Constrained-width card.</Text>
</Card>
```

### Badge with a one-off background

```tsx
<Badge style={{ background: 'var(--my-brand-gradient)' }}>Pro</Badge>
```

## Guidelines

1. **Prefer tokens over hard-coded values.** `style={{ color: 'var(--lucent-success-text)' }}` is better than `style={{ color: '#16a34a' }}` because it adapts to theme changes.
2. **Don't replicate what a prop already does.** If `<Text color="danger">` achieves the same result, use the prop — it's self-documenting and type-checked.
3. **One-off is the key phrase.** If you find yourself applying the same `style` override across many instances, consider whether a custom token or wrapper component is more appropriate.
