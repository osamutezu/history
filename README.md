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

## v3.9 — Atlas Rebuild (critical integration repair)
- **Critical:** v3.8 contained clean-atlas.css and clean-atlas.js but did not actually reference them from index.html. v3.9 wires both assets into the live page, adds the previously missing top navigation, collapsible settings drawer, and full chronology markup.
- Chronology is a separate scrollable chronological list of all 447 source records from 600 BCE to 2016 CE, ordered by recorded representative year. Filter by name, discipline and entity type, and jump to era. Records include source and verification metadata where available.
- Default full-width network; filters and detailed settings open on demand.
- Three display options: IMAGES (only real loaded thumbnails plus small nodes for records without thumbnails), HYBRID (existing cards), STRUCTURE (network dots/lines). No fabricated historic photographs.
- Controls, bilingual localization, minimap, touch navigation, focus and research tools remain in the repository.
- Data remains 447 nodes and 225 relations; all are historical editorial seed data and require verification.
- Static JavaScript checks and archive integrity passed. Browser execution in this environment was blocked by administrator policy, so visual interaction cannot be certified.

## v4.0 — Mobile visibility repair
- Mobile-first CSS explicitly sets dark page, panel, and chronology backgrounds with high-contrast readable text; eliminates white form controls on dark panels.
- On narrow screens, the network uses the full available width. Filters become an overlay; control drawer becomes a full-width scrolling panel; header and language switch are resized.
- Chronology is independently scrollable with readable 14px names and 12px descriptions and compact 2-column rows.
- Adds a loading/error status when SVG graph nodes are absent, instead of a completely unexplained blank network.
- Retains the existing bilingual controls, chronology, touch navigation, all data and research features.
- No external dependencies. Upload **all** ZIP contents at repository root, not just index.html.
- Verified: syntax checks for all JS and inline scripts, 447 source nodes, complete asset references, ZIP CRC. Chromium browser test was attempted but blocked by the runtime administrator (ERR_BLOCKED_BY_ADMINISTRATOR); real iPhone verification remains necessary.

## v4.1 — Reference-video composition analysis & chronological redesign

Source: user-provided Instagram Reel recording (104.1s); sampled multiple frames. The source demonstrates a taxonomy/visual-archive grammar rather than a uniform force graph: outlined domain/operation nodes, tiny category glyphs, fine curved relationship bundles, clusters of actual image thumbnails with differing aspect ratios, restrained labels, and strong whitespace/scale hierarchy. The website does not claim the video's actual graph is a history chronology.

- **Time Map**: new independent graphical chronology with strict left-to-right representative-year placement, from 600 BCE through 2016 CE. Horizontal zoom 1–8 and scrolling. Three parallel lanes for Philosophy, Art and Architecture; all 447 dated records are included (multiple nodes can share a year and overlap when zoomed out). Selecting a dot shows its source year, type, description, verification status and recorded relationship count. Optional selected-only curved edges (no invented relationships).
- **All Entries**: preserves the full sortable/filtered chronological list, which is better for finding exact names than a dense graphic.
- **Image Atlas / Relation Study / Taxonomy**: new network reading modes. Taxonomy uses a *visually distinct inferred category overlay*, connecting a sample of nodes to the existing Philosophy/Art/Architecture categories. These lines are **classification guides, not historical relationship edges**. Actual history edges remain unchanged.
- Mobile time map supports native horizontal scrolling. Existing mobile repair, Japanese/English controls, pinch zoom, minimap, research and image curation are retained.
- Data still contains 447 nodes and 225 historical relationships; many are provisional and require source review. Representative years should not be interpreted as birth years.
- No fabricated archival imagery. Actual image coverage is limited by verified remote image availability.
- Static JavaScript syntax and ZIP integrity checked. Headless browser navigation was blocked by administrator policy (`ERR_BLOCKED_BY_ADMINISTRATOR`), so runtime interaction is not certified.
- GitHub Pages remains Deploy from a branch → main → /(root).

## v4.2 — Visual system refinement
- EXHIBITION VIEW / RESEARCH VIEW switch: image-led exhibition view emphasizes actual retrieved imagery and minimizes placeholder cards and labels; research restores mixed cards.
- Dedicated exhibition controls, with the preexisting detailed options still accessible.
- Strict Wikidata QID → P18 fallback for entries with an exact Wikidata identifier, without guessing images from unrelated search results.
- Subtle marks for entries without images, rather than large decorative placeholders.
- Preserves chronology, bilingual interface, mobile pan/pinch, graph relations and previous modes.
- Video-level image richness still requires further verified image sourcing and graph data enrichment.
- Static JavaScript syntax, file dependencies, dataset integrity and archive integrity checked; browser visual test was blocked by administrator policy.

## v4.3 — Refined Atlas
- Default exhibition mode: images and delicate graph lines take priority; research mode is available with one tap.
- Fixed an image discovery bottleneck: exact Wikidata-QID P18 lookup now starts for eligible visible records even if the English Wikipedia title lookup has not failed yet. It still uses exact entity IDs only; no guessed imagery.
- Adjusted card size and visual hierarchy by node connectivity and type; fewer equally sized thumbnails.
- Consolidated duplicate floating controls and improved chronology contrast, date alignment, and mobile reading size.
- Retained all prior static GitHub Pages files, bilingual UI, touch controls, chronology and 447 nodes/225 edges.
- Browser sandbox blocks rendering verification; syntax and archive tests are performed.

## v4.4 — Editorial visual hierarchy
- Exhibition mode removes redundant graph SVG labels while retaining clickable node hit targets.
- Subdues unselected structural links and background dots; keeps image atlas as foreground.
- Adds an explicit source-image / recorded-relationship legend and mobile contrast and safe-area improvements.
- Preserves Japanese toggle, chronology, pinch zoom, research and network data.
- Does not invent new historical relationships or imply all records have images.
- Static validation completed; browser execution blocked by administrator policy, so actual device behavior is unverified.
