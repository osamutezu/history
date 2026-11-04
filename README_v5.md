# HISTORY NETWORK v5.0 — Reference Reconstruction

This is a new visual front end, rebuilt from the supplied 46-second reference reel rather than incrementally styling the older interface.

## Design principles
- The reference shows a restrained white/black field, small taxonomy/group nodes above or among a field of image thumbnails, long thin curved hierarchical connections, and generous unoccupied space.
- Separate visual hierarchy: discipline headings, movement nodes, person nodes, and work images. Rectangular images are larger than ordinary dots; edge weight is subordinate to the content.
- Fixed conceptual discipline bands and type strata, not an arbitrary physical claim of influence. Original historical edges remain separately recorded and only display in focus or ALL mode.
- Image assignment is by exact existing Wikidata QID with P18 claims. Never fuzzy-match names or invent portraits. Network remains useful if the image API is offline.
- Chronology: all 447 records in ascending representative year, with optional discipline columns, search and discipline filters. Dates are not necessarily birth dates.
- The new root index.html and atlas-v5.css / atlas-v5.js are deliberately isolated from the accumulation of legacy CSS/JS to prevent overlay collisions and white/black screen failures. The previous app remains accessible at legacy.html.
- Mobile: responsive typography, full-width canvas, drag/pinch gestures, zoom controls, bottom inspector.
- Existing research/export/import utilities remain in legacy.html and accompanying files.
- Data remains 447 records and 225 provisional, unverified relations.

## Limitations
This is a substantial architectural redesign, not a pixel-identical copy of the reference reel. External Wikimedia images require connectivity and suitable Wikidata P18 values. Historical relations have not been independently verified. Browser automation was attempted but blocked by an administrator policy (ERR_BLOCKED_BY_ADMINISTRATOR). JS syntax and archive integrity have been checked.

## Deployment
Upload all ZIP files at the GitHub repository root; GitHub Pages: Deploy from a branch → main → /(root).
