---
"lucent-ui": minor
---

**PageLayout — collapsible sidebar, drawer mode, and mobile support**

PageLayout now supports a collapsible sidebar (`collapsible` prop) that can shrink to an icon rail on desktop and slide in as a drawer on mobile. The sidebar width, collapse breakpoint, and drawer mode are all configurable. Collapsed state is controlled or uncontrolled via `collapsed` / `defaultCollapsed` / `onCollapsedChange`. The drawer overlay uses a semi-transparent backdrop and supports swipe-to-dismiss on touch devices.

**Tab Page composition pattern**

New `tab-page` pattern demonstrating a settings-style layout with a top-level heading + action button, and a Tabs component whose panels swap Card-wrapped content. Includes a detail-view variant (order page with Items / Shipping / History tabs). Registered in MCP tools.

**Search & Filter Panel composition pattern**

New `search-filter-panel` pattern for full-featured filter panels. Default variant uses a Collapsible trigger with active-filter badge, housing SearchInput, filter controls (Select, MultiSelect, DateRangePicker), active-filter chips with dismiss, and apply/clear actions. Includes a vertical sidebar variant for drawer/sidebar layouts. Registered in MCP tools.

**Multi-Step Wizard composition pattern**

New `multi-step-wizard` pattern for stepped forms with progress indicator and back/next navigation. A 4-step checkout wizard example with shipping, payment, preferences, and review/confirm steps. Includes a "Final step with summary & confirm" variant. Uses Stack/Row for layout, Progress for step tracking, and FormField for inputs. Registered in MCP tools and added to dev preview.
