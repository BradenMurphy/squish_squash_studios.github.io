# Squish Squash Studios

Messy-play & sensory-development website for Durbanville, built with
**React + [Ant Design](https://ant.design/) (antd v5) + Vite + TypeScript**.

The original hand-written static site is preserved under [`legacy/`](./legacy).

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server with hot reload  -> http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

---

## How it builds (the "two files" setup)

`npm run build` bundles the whole app into **one JS file + one CSS file** with
stable names, and Vite injects both `<script>` / `<link>` tags into the
generated `dist/index.html`:

```
dist/
  index.html                  # your SEO/OG meta + the two tags below, auto-injected
  assets/squish-squash.js     # React + antd + app, single bundle (~398 kB gzip)
  assets/squish-squash.css    # all styles, single file (~7 kB gzip)
```

> **Why not UMD?** UMD is for libraries imported by *other* bundlers (AMD /
> CommonJS / global). This is an app that runs in the browser, so it doesn't
> need a UMD wrapper. The normal Vite build already produces exactly one JS +
> one CSS and wires them into `index.html` for you — that's the simplest path
> and what's configured here.
>
> If you ever need to embed the app inside a page you *don't* control (a CMS,
> another site), switch to an **IIFE** single-file bundle via Vite library mode
> (`build.lib` with `formats: ['iife']`) and include the two files manually on a
> `<div id="root">`. UMD also works as a global script but adds an unused wrapper.

React and antd are bundled in, so the JS file is large but fully self-contained
(no runtime CDN dependencies except Google Fonts and the Unsplash/OSM images).

---

## Project structure

```
index.html              # Vite entry: SEO meta + Google Fonts + <div id="root">
vite.config.ts          # base './', single-file output names
src/
  main.tsx              # React root, ConfigProvider + antd theme
  App.tsx               # assembles the page sections
  theme.ts              # antd theme tokens ported from the old :root variables
  theme.css             # blobs, hero divider, splats, fonts (no antd equivalent)
  data/                 # all editable content lives here
    site.ts             # contact details, links, EmailJS config, nav items
    benefits.ts  schedule.ts  gallery.ts  faqs.ts
  components/
    Header.tsx          # Layout.Header + Menu (desktop) / Drawer (mobile)
    Hero.tsx  About.tsx  Classes.tsx  Gallery.tsx  Faq.tsx
    Contact.tsx         # antd Form + EmailJS + Leaflet map
    StudioMap.tsx       # react-leaflet map card
    Footer.tsx  WhatsAppFab.tsx  WhatsAppIcon.tsx  Logo.tsx
.github/workflows/deploy.yml   # builds and deploys dist/ to GitHub Pages
legacy/                 # original static index.html / style.css / script.js
```

antd replaces the hand-rolled interactions from the old site: `Drawer` (mobile
nav), `Image.PreviewGroup` (gallery lightbox), `Collapse` (FAQ accordion),
`Form` (booking + validation), `message` (toasts), `FloatButton` (WhatsApp).

**Editing content:** change the files in `src/data/` — no JSX edits needed for
copy, schedule rows, FAQ entries, gallery images, or contact info.

---

## Configuration before going live

The booking form uses **EmailJS**. Set your real keys in
[`src/data/site.ts`](./src/data/site.ts):

```ts
export const emailjsConfig = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
}
```

The EmailJS template field names must match the form inputs: `parent_name`,
`email`, `phone`, `child_info`, `preferred_session`, `allergies_requirements`.

---

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every
push to `main`. In the repo settings, set **Pages → Source → GitHub Actions**.

`base` is `./` (relative), so the build works on a project subpath *and* on the
`squishsquashstudios.co.za` custom domain. For the custom domain, add a
`public/CNAME` file containing `squishsquashstudios.co.za`.
