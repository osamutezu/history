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

## v3.0 — Semantic Zoom & Label Collision
- Auto detail levels: overview (under 0.82×), browse (0.82–1.65×), detail (above 1.65×).
- Manual AUTO / OVERVIEW / DETAIL controls, with persisted choice.
- Overview suppresses low-degree visual cards (data and interactions remain in the original SVG).
- Card scale responds to zoom level, reducing clutter in overview.
- Label placement avoids overlaps and limits visible labels to 120; selected labels take priority.
- Pauses Wikipedia image discovery in overview to avoid unnecessary network traffic.
- All existing 447 nodes and 225 historical relations retained; no invented edges.
- GitHub Pages stays Deploy from a branch → main → /(root).


## v3.1 — Navigation and minimap
- Added zoom +/- and Fit buttons with 42px touch targets.
- Added interactive minimap showing current viewport and visible node distribution. Tap minimap to recenter.
- Added keyboard shortcuts: +/- to zoom, 0 to fit.
- Retains two-finger pinch zoom, single-finger pan, semantic zoom, 447 nodes, 225 relationships and all existing panels.
- Works on static GitHub Pages branch deployment, no build.
- Tested JavaScript syntax and data references; mobile device interactions require live testing.

## v3.2 — Focus Atlas
- Click/tap a node to overlay its documented first-degree relationship lines and nearby nodes.
- Toggle 2-HOP to show indirect graph paths; these are paths in the dataset, not proven historical influence.
- Focus highlight remains visually separate from the original graph; original research panels and filters remain.
- Hover over nodes on desktop for names, fields and recorded connection counts.
- Clear Focus and Escape remove focus. Touch pinch, minimap, semantic zoom and previous visual controls retained.
- All historical data unchanged (447 nodes, 225 edges).
- Static GitHub Pages deployment: Deploy from a branch → main → /(root).
- Syntax and JSON references checked; browser run blocked by environment policy, so interaction not verified.

## v3.3 — Visual composition
- Image framing: adaptive (preserve unusually wide/tall artwork), cropped, or full image.
- Density modes: balanced / dense / airy. Balanced/airy prioritize well-connected nodes and suppress overlapping low-degree cards at overview/browse zoom. All nodes remain in data and SVG interaction layer.
- Thread modes: all / soft / selected only.
- Settings persist locally. v3.2 focus lens, touch gestures, navigation and research tools preserved.
- 447 nodes / 225 edges unchanged.
- GitHub Pages: Deploy from a branch → main → /(root).

## v3.4 — Spatial Cards
- Adaptive image card placement searches 13 nearby positions, prioritising high-degree nodes.
- Optional fine tether lines connect displaced cards to their true network node positions; historical graph topology is unchanged.
- New PLACEMENT (AVOID OVERLAP / ANCHORED) and CONNECTORS (ON / OFF) controls, saved locally.
- DENSE preserves original dense layout; BALANCED/AIRY use collision-aware card placement.
- Previous functionality and all 447 nodes / 225 edges preserved.
- GitHub Pages: Deploy from a branch → main → /(root).

## v3.5 — Layout Engine
- New ATLAS, CLUSTERS, THREAD STUDY presets combine spatial composition, card density, connector display and relationship-line emphasis.
- LRU-style 16-entry in-memory layout cache avoids repeating the expensive force simulation when selection or view controls change without changing the underlying filtered network.
- Layout cache invalidates automatically for changed nodes, filtered edges, mode, spatial composition, link distance and cluster controls.
- Presets never alter historical data or fabricate relations. Existing visual tools, minimap, touch gestures, focus lens and semantic zoom remain.
- For debugging, window.HN_LAYOUT_STATS() returns cache hits, misses and entry count.
- GitHub Pages deployment remains Deploy from a branch → main → /(root).

## v3.6 — Image Pipeline
- Prioritises image discovery for nodes actually inside the visible canvas, ordered by recorded connection count.
- Caps the image-discovery working set at 180 visible nodes and reduces Wikipedia API batches from 12 to 8.
- Debounces image-discovery scheduling (260 ms) during pan/zoom, reducing redundant requests.
- Requests async image decoding and keeps previously loaded images cached in memory.
- Keeps exact Wikipedia title matching: an image is not attached when the article identity is uncertain.
- Existing 447 nodes, 225 relations, mobile pinch zoom, visual composition, focus lens, minimap and layout presets are preserved.
- GitHub Pages: Deploy from a branch → main → /(root).
- JavaScript syntax and ZIP integrity checked; real browser interactions not verified.

## v3.7 — Bilingual Visual Atlas
- Japanese / English UI switch, saved locally. Reversible translation layer preserves raw data, IDs, filters, CSV/JSON exports and evidence fields.
- Japanese names for a curated set of major figures; others retain original spellings rather than guessed transliterations. Existing Japanese descriptions are preserved.
- Improved visual density: larger cards at distant zoom, images fetched in overview, and subtle curved relationship lines. No artificial historical connections are introduced.
- The reference video is an aesthetic target, not a claim of identical rendering. Wikimedia images require network access and some entities have no reliable matching thumbnail.
- Deployment: GitHub Pages / Deploy from a branch / main / /(root).
