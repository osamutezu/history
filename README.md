# HISTORY NETWORK v2.1

Static site for GitHub Pages. Based on v2.0 with all original files and functionality retained.

## Deploy
Upload all files in this ZIP to the repository root. Pages: Deploy from a branch / main / (root). No build or GitHub Actions required.

## Changes
- Research Lab: live network component counts, isolated nodes, degree ranking and integrity checks.
- Research Lab: JSON export for reproducible graph statistics.
- Provenance metadata normalized for all existing nodes and relations.
- Original path exploration, timeline playback, filters, import/export, and review workflow retained.

## Limitations
188 nodes / 160 relations are editorial prototype data. No new Wikidata collection or independently verified historical relation was added in this release. Research Lab checks data integrity and graph structure, **not historical truth**. The entire project should be reviewed before academic citation.

## Files
- `index.html`: application
- `data.js`: browser-loaded data
- `data.json`: editable source data
- `enhancements.js`: v2.0 tools
- `research-lab.js`: v2.1 analysis
- `build_data.py`: optional local helper
