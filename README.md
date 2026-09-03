# Brokerage Bill Generator

A simple, fully client-side web app for creating professional "Bill For Brokerage" PDF invoices. No login, no backend, no database — everything (your profile, saved bills, settings) is stored locally in your browser's `localStorage`.

## Features

- My Details: save your recurring name/address/PAN/bank details locally
- Create Bill: recipient info, dynamic line items, automatic subtotal/total
- Live invoice preview modeled on a traditional brokerage bill layout
- Download as PDF (generated in-browser with jsPDF, A4 portrait)
- Print directly from the browser
- Saved Bills: open, duplicate, delete, and re-download any past bill
- Auto bill numbering (`BR-001`, `BR-002`, ...), editable prefix/start number
- Export/Import all data as a JSON backup file
- Works fully offline once loaded; nothing is ever sent to a server

## Tech Stack

React + TypeScript + Vite + Tailwind CSS + jsPDF. Pure static site — no backend, no database, no auth.

## Run Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs a fully static site to `dist/`. Type-checks with `tsc -b` before bundling.

Preview the production build locally:

```bash
npm run preview
```

## Deploy

The build is 100% static (`dist/`) — deploy it anywhere that serves static files.

### GitHub Pages

1. Push this repo to GitHub.
2. `vite.config.ts` already sets `base: './'` so the build works from any subpath — no repo-name-specific config needed.
3. Easiest route: use the official Pages action. In your repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**, then add `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   permissions:
     contents: read
     pages: write
     id-token: write
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm install
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

4. Push to `main` — the site deploys automatically.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- No environment variables required.

### Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`

## Data & Privacy

- All personal/business details and saved bills live only in your browser's `localStorage` on this device.
- Nothing is uploaded to any server or third party.
- Clearing your browser data (or using a different browser/device) will remove it — use **Settings → Export Data** regularly to back up a JSON file, and **Import Data** to restore it.

## Project Structure

```
src/
  components/    ProfileForm, BillForm, BillItems, InvoicePreview, SavedBills, SettingsPanel, DataManager
  services/      storage.ts (localStorage), pdfGenerator.ts (jsPDF)
  types/         invoice.ts, profile.ts
  utils/         currency.ts, validation.ts, numbering.ts
  App.tsx
  main.tsx
```

## Limitations

- Designed for a single profile per browser/device (no multi-user accounts, by design).
- PDF text is rendered with jsPDF's built-in fonts (Times/Helvetica), not the exact decorative typeface in the original sample invoice — layout and structure closely follow it.
- Very long descriptions wrap to a single line per item in the PDF table row; extremely long text may get clipped — keep item descriptions concise.
- Backup/restore is manual (export/import JSON) since there is no cloud sync by design.
