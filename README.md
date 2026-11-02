# HISTORY NETWORK — prototype v0.1

Interdisciplinary historical network atlas. Philosophy, Art, and Architecture can be viewed independently or together.

## Local preview

```bash
npm install
npm run dev
```

## Deploy with GitHub Pages

1. Create a **public** GitHub repository (e.g. `history-network`).
2. Upload these project files to the repository root.
3. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The included workflow builds and deploys on every push to `main`.

## Current prototype

- Network / Genealogy / Timeline views
- Discipline filters and cross-discipline edge filter
- Accumulation / Snapshot timeline slider
- Search, pan/zoom, and node details
- JSON-based extensible data structure

## Data caution

This is a **small illustrative dataset**, not a completed historical reference. The `year` property represents a selected reference date (e.g. publication, foundation, major work), **not necessarily birth date**. `end` is an approximate display bound and is not universally a death year. Entity URLs provide starting points, but **edge-specific citations have not been verified**. Before public historical claims, add source URL(s), source quotations or notes, date precision, editorial review status, and provenance to each relation. Do not infer influence from chronology alone.

One sample entity reference may be inaccurate; verify Wikidata IDs against labels before publication. No live Wikidata import is implemented yet.

## Next steps

Implement verified Wikidata import and editorial validation; improve historical time semantics and multi-relationship visualization; add data editing interface.
