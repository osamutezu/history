# HISTORY NETWORK v8.5 — SINGLE INSPECTOR

Based on latest v8.4 actual HTML.

Fixes duplicated inspector drawers: the original global #inspector was opening on the left, while the genealogy's new details panel opened on the right. The genealogy now uses only its own details panel; the original inspector remains for the separate network mode. The options and details panels are mutually exclusive. The sole open panel is narrower (300px) and reserves 312px of horizontal space on desktop. Closing it returns the width to the genealogy.

No historical data or registered relations modified. Existing modes and functionality retained.
All inline JavaScript passed node --check; ZIP integrity passed. Browser visual QA not performed.
