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


## v2.5 VISUAL STUDIO
- Immersive view (hide panels, Esc to exit), adjustable card size, thread visibility and atmosphere; settings saved locally.
- Existing 447 nodes, 225 relations and all previous data/editing features preserved.
- Real Wikipedia thumbnail fetching is best-effort and **not** verified entity-to-image matching; image availability depends on the browser and API.
- Visual line density reflects only registered historical relations; no fictitious links are created.
- The PNG export remains canvas-only, not a full-page screenshot.
- GitHub Pages: Deploy from a branch / main / (root). Upload all files together.


## v2.6 Image Curator
- Adds explicit per-node Wikimedia image URL and Commons source-page overrides, review status, import/export, and browser persistence.
- Click IMAGE CURATOR in the lower right, select a node, and save a direct Wikimedia upload image URL.
- Export IMAGE-MAP.JS and replace the root `image-map.js` file to publish curated images. The JSON export is a backup.
- Wikipedia auto-discovered thumbnails remain provisional, and may be incorrect. No image license is automatically verified.
- Existing network data, visual studio, and other tools remain unchanged.
- Deploy from branch main /(root), upload all ZIP contents.


## v2.7 — COMPOSITION
- Hierarchical image-card sizing by observed graph degree, uniform mode, thread-study mode.
- Optional dimming of isolated nodes and label density based on graph degree.
- Controls persist locally; no invented relationships or extra nodes.
- Fixed image-map / image-curator loading sequence; curation overrides read dynamically.
- Image lookup remains provisional, and may fail due to API/CORS; explicit curator review is recommended.
- Existing GitHub Pages branch deployment remains unchanged.


## v2.8 SPATIAL ENGINE

- Adds three Network spatial compositions: CONSTELLATION (connected-component-aware anchors), DISCIPLINE CLUSTERS, CLASSIC FORCE.
- Adds community separation control. Community groups are determined only from currently filtered existing edges; no relationships are invented.
- Deterministic initial positioning, preserving all existing graph modes and controls.
- 447 nodes and 225 edges unchanged.
- Deploy from branch → main → /(root), no build step.

## v2.9 — Touch navigation
- Two-finger pinch zoom on mobile, anchored to the midpoint between fingers.
- One-finger drag pans the network.
- Desktop scroll-wheel zoom anchors to cursor; double click zooms in.
- Pointer capture, pointer cancellation and transition from two fingers to one are handled.
- Accidental click following a pinch/drag is suppressed.
- Zoom range 0.35×–8×; SVG touch-action:none prevents page scrolling within the graph.
- Data, views, image atlas, composition, and existing research tools retained.
- GitHub Pages: Deploy from a branch → main → /(root).
- Syntax and dataset reference checks passed; physical-device interactive testing not performed.
