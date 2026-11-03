# HISTORY NETWORK v2.2 — Research Catalogue expansion

Static GitHub Pages application. Deploy from a branch → main → /(root). No build system, GitHub Actions or credentials required.

## Update
Upload **all files** in this archive to repository root, replacing existing matching files. Preserve branch deployment.

## Dataset
- Total: 447 nodes / 225 relationships.
- Added this release: 259 editorial candidate nodes / 65 provisional attribution edges.
- Philosophy, Art, Architecture: people, movements and works.
- New `research-catalogue.js`: search by name, discipline, type; chronological review list; CSV review-queue export.
- Retains pathfinding, playback, RESEARCH LAB, Wikidata CSV workflows, all prior UI features.

## Academic integrity
**Not independently source-verified.** The newly added entities and links are editorial candidates only. Dates are approximate milestones, not birth years. Do not cite the data as historical evidence without checking authoritative references. Work attribution links are unverified and not evidence of historical influence. No automated Wikidata ingestion was performed. The original dataset also includes unverified records.

## Technical
`data.json` is the source; `data.js` is its runtime mirror. Run `python build_data.py` after editing data.json. The in-browser DATA.JS export is suitable for direct publishing but does not automatically update data.json.


## v2.4 — IMAGE ATLAS
- Adds opt-out Wikimedia/Wikipedia image discovery and real thumbnail rendering (when an unambiguous article image is available).
- Images load progressively in the browser from Wikipedia's public API. This needs internet; thumbnails are not bundled into the ZIP.
- The source/credit link is shown in the node detail panel when available; copyright/license must be checked on the Wikimedia file page before reuse.
- Nodes without a matching public image retain the designed abstract placeholder.
- Interactive SVG graph, filtering, history data and GitHub Pages branch deployment are preserved.
- The image layer is drawn on a canvas, so browser Save View PNG captures the current graph view only, not the whole UI.
- No historical relationships have been inferred from the images.
