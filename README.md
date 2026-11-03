# HISTORY NETWORK v2.0

Static GitHub Pages project. Source baseline: v1.7. No build step.

## Deploy
Upload the contents of this ZIP into the repository root. GitHub Pages: Deploy from a branch / main / (root).

## Files
- index.html: existing application with v2 integration
- data.js: runtime data loaded by index.html
- data.json: editable data source
- enhancements.js: path search, timeline playback, data quality report
- build_data.py: rebuild data.js from data.json

## v2 additions
- 49 editorial work nodes and 48 provisional creator/author/architect relations.
- Shortest path exploration, optionally respecting edge direction and current filters.
- Timeline playback with adjustable step size.
- Data quality JSON report.
- Keyboard shortcuts: / to search, Escape to clear.

## Data limitations
The 49 new works and 48 relationships are editorial candidates, NOT independently verified Wikidata records.
A graph path does not imply causality. Existing v1.7 provisional relations are preserved.
Dates may be approximate and should be checked against authoritative references.

## Validation
JavaScript syntax and JSON integrity tested. Chromium UI testing was attempted but blocked by the runtime environment.
