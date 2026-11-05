# HISTORY NETWORK v9.0 — VECTOR TEXT / ORDERED LAYOUT

Based on latest actual v8.9.

- All chronology node labels, cluster titles, year ticks, and lane headers are real DOM text, not canvas raster glyphs. Text remains sharp at any zoom.
- Chronological discipline lanes now use deterministic three-column grids with consistent spacing, no force-driven lateral scatter.
- Labels are prioritized and collision-filtered; person labels appear at zoom >= 135% to avoid crowding.
- Node portraits, curves, cluster envelopes, and overview remain canvas graphics.
- 507 nodes, 256 relations preserved.

Validation: JavaScript syntax and ZIP integrity checked. Browser end-to-end test unavailable.
