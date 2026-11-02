# HISTORY NETWORK v1.6 — GitHub Pages (Deploy from a branch)

Upload **index.html** and **data.js** together to the root of your existing GitHub repository. Leave Settings > Pages > Deploy from a branch > main > /(root) unchanged.

## Editing historical data
- `data.json` is the human-readable editable master copy (125 nodes / 96 provisional relations).
- `data.js` is the actual data file loaded by the static website. Do not upload only data.json expecting the site to update.
- To publish changes from the UI: import/edit data, click **EXPORT GITHUB DATA.JS**, then replace `data.js` in the GitHub repository. The site code (`index.html`) need not change.
- To regenerate data.js from an edited data.json: run `python3 build_data.py` locally and upload data.js.
- JSON export remains available for backups and interchange.
- Historical links remain unverified until sources are reviewed.

No React build, GitHub Actions, or backend required.
