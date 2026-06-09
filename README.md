# Windsor Forest Takeover Cruise

Information-and-routing site for the Windsor Forest alumni cruise aboard Royal Caribbean's Utopia of the Seas, June 2027.

Static HTML/CSS/JS. No build step. Vercel auto-detects and deploys.

## Updating content

Every variable value (agent name, group code, prices, sail dates, FAQ, etc.) lives in [`config.js`](./config.js). At go-live, edit values in that file and redeploy. The page reads from this object — no markup edits needed.

Anything still wrapped in `[SQUARE_BRACKETS]` renders as a visible yellow-highlighted placeholder on the page, so missing content is easy to spot.

### Files

- `index.html` — page structure (Home tab + Cruise Details tab)
- `styles.css` — dark-olive theme with gold accents
- `script.js` — tab switching, countdown, config injection, list/table rendering, click tracking
- `config.js` — single source of truth for all content

## Deploy to Vercel

1. Connect this repo on [vercel.com](https://vercel.com)
2. Framework preset: **Other** (static)
3. No build command needed
4. Output directory: `./` (root)
5. Deploy

Pushes to `main` auto-deploy.

## Local preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Analytics

Click tracking is wired on every CTA via `data-cta` attributes. To hook in GA/Plausible, edit the tracker block in `script.js`.
