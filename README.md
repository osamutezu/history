# HISTORY NETWORK v6.4 — CHRONOLOGICAL REFINEMENT

Based on actual v6.3 files; preserves 447 nodes, 225 provisional relations and all existing site modes.

## Fixes
- Time-jump controls and related-node navigation now scroll the timeline's actual scrolling container rather than the window (the site uses an overflow-hidden document).
- Selected nodes are drawn last and stay visually above other nodes.
- Less cramped three-column per-discipline arrangement with larger movement labels and nodes.
- Timeline year ticks show the number of registered entries in their indicated time window.
- Dynamic device pixel ratio caps canvas allocation to approximately 6 million pixels to reduce memory pressure on mobile.
- Version badge updated to v6.4.

Known limits: original reference's rich photographic atlas is not yet reached. No new historical links are inferred. Browser runtime validation is needed.
Deploy: replace root index.html on GitHub Pages.
