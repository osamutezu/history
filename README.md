# HISTORY NETWORK v9.4 — UNIFORM TIME GRID

Based on actual v9.3. Fixes a serious chronological mismatch: prior cluster packing moved nodes vertically away from their registered year, while axis labels used a different coordinate function. Now every node is positioned at exactly `ycoord(node.year)` and all timeline ticks use the same linear transform (`4px/year`), with labeled grid lines every 25 years and major grid lines every 100 years. Movement duration bars also use the same coordinate transform, so their lengths are proportional to registered durations. No collision solver may shift a node in time. Same-year, same-field nodes sit horizontally side by side. All 507 records, 256 relationships and six fields preserved.

Checks: JS syntax, data counts, ZIP integrity. Browser runtime testing unavailable.
