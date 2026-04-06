---
"lucent-ui": minor
---

**Charts sub-library — SparkLine, BarChart, AreaChart, DonutChart**

Adds a new `src/components/charts/` tier with four zero-dependency, pure-SVG chart components that use lucent tokens for colors and automatically respect light/dark mode.

- **SparkLine** — compact inline trend line for KPI cards. Supports smooth monotone-x curves, optional area fill, and hover interaction with a dot + crosshair that glide between data points via 150ms CSS transitions. Tooltip hidden at first/last points to avoid clipping.
- **BarChart** — vertical bar chart with auto-scaled y-axis, grid lines, optional value labels, rounded top corners, and per-bar color overrides. Non-hovered bars dim on hover.
- **AreaChart** — filled line chart with single or multi-series support, smooth curves, optional dots, and auto-sampled x-axis labels. Hover crosshair with colored dots per series.
- **DonutChart** — ring chart with configurable thickness, segment gaps, auto-palette cycling, and a `centerLabel` slot for arbitrary React content. Hovered segments nudge outward along their midpoint angle.

All charts use `preserveAspectRatio="none"` for full-width rendering with DOM-based text labels and circles to avoid stretch distortion. Interactive hover tooltips use the existing `Tooltip` atom via a new `open` prop for controlled visibility.

**Metrics Dashboard composition** — KPI cards with sparkline trends, a revenue bar chart, traffic-sources donut with legend, and a user-growth area chart. Registered as a pattern in the MCP tools.

**Tooltip `open` prop** — new optional boolean on the `Tooltip` atom that overrides internal hover state for programmatic control.
