---
"lucent-ui": patch
---

**Card (combo variant) — preserve body framing when header or footer is absent**

The combo variant relies on the `header` and `footer` slots to provide vertical chrome around the elevated body. When one or both slots were omitted, the elevated body sat flush against the wrapper edge, breaking the "framed body" metaphor.

The body now mirrors the existing horizontal inset pattern (`calc(px / 3)`) vertically: when `header` is absent it applies `marginTop: calc(py / 3)`, and when `footer` is absent it applies `marginBottom: calc(py / 3)`. Both margins apply when neither slot is set. The inset scales with the `padding` prop (sm / md / lg). Combo cards with both header and footer render identically to before.
