<div align="center">

# 🎨 Squish Squash Studios

### Where messy play meets sensory development

Marketing site for a messy-play & sensory-development studio in **Durbanville, Cape Town** —
vibrant, mobile-friendly, and built to deploy free on GitHub Pages.

[**🌐 Live site →**](https://squishsquashstudios.co.za)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5-0170FE?logo=antdesign&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)

</div>

---

## ✨ Features

- **Single-page experience** — hero, benefits, class schedule, gallery, FAQs, and a booking form
- **Booking form** with validation that opens WhatsApp with all the details pre-filled — no backend, no email service to maintain
- **Gallery lightbox** with keyboard navigation (antd `Image.PreviewGroup`)
- **Interactive studio map** (Leaflet + OpenStreetMap)
- **Fully responsive** — desktop nav collapses to a mobile drawer
- **Playful brand theme** — custom colours, rounded fonts, floating blobs & animated splats
- **Zero-config deploy** to GitHub Pages via GitHub Actions

---

## 🛠️ Tech stack

| Area        | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | [React 18](https://react.dev/)                    |
| UI library  | [Ant Design v5](https://ant.design/)              |
| Build tool  | [Vite 6](https://vite.dev/)                       |
| Language    | [TypeScript](https://www.typescriptlang.org/)     |
| Map         | [react-leaflet](https://react-leaflet.js.org/)    |
| Bookings    | WhatsApp deep link (no backend)                   |
| Hosting     | [GitHub Pages](https://pages.github.com/)         |

---

## 🚀 Getting started

```bash
npm install      # install dependencies (first time only)
npm run dev      # dev server with hot reload  ->  http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

> Requires **Node.js 18+**.

---

## 📦 How it builds

`npm run build` compiles the whole app into **one JS file + one CSS file** with stable
names, and Vite injects both tags into the generated `dist/index.html` automatically:

```
dist/
├─ index.html                 # SEO/OG meta + the two tags below, auto-injected
├─ assets/squish-squash.js     # React + antd + app  (~398 kB gzip, self-contained)
├─ assets/squish-squash.css    # all styles          (~7 kB gzip)
└─ CNAME                        # custom domain, copied from public/
```

`dist/` is the complete deployable site. Serve it over HTTP (e.g. `npm run preview`) —
don't open `index.html` directly, as the relative asset paths need a server.

---

## 🗂️ Project structure

```
index.html              # Vite entry: SEO meta + Google Fonts + <div id="root">
vite.config.ts          # relative base + single-file output names
public/
  CNAME                 # custom domain (copied into dist on every build)
src/
  main.tsx              # React root, ConfigProvider + antd theme
  App.tsx               # assembles the page sections
  theme.ts              # antd theme tokens (brand colours, fonts, radii)
  theme.css             # blobs, hero divider, splats, fonts (no antd equivalent)
  data/                 # ← all editable content lives here
    site.ts             #   contact details, links, EmailJS keys, nav items
    benefits.ts  schedule.ts  gallery.ts  faqs.ts
  components/
    Header.tsx          # Layout.Header + Menu (desktop) / Drawer (mobile)
    Hero.tsx  About.tsx  Classes.tsx  Gallery.tsx  Faq.tsx
    Contact.tsx         # antd Form -> opens WhatsApp with details pre-filled
    StudioMap.tsx       # react-leaflet map card
    Footer.tsx  WhatsAppFab.tsx  Logo.tsx
.github/workflows/deploy.yml   # builds and deploys dist/ to GitHub Pages
legacy/                 # original hand-written static site (index.html/style.css/script.js)
```

antd replaces the hand-rolled interactions from the original static site: `Drawer`
(mobile nav), `Image.PreviewGroup` (gallery lightbox), `Collapse` (FAQ accordion),
`Form` (booking + validation), `message` (toasts), and `FloatButton` (WhatsApp).

---

## ✏️ Editing content

All copy and data live in `src/data/` — no need to touch the components:

| File          | What it controls                              |
| ------------- | --------------------------------------------- |
| `site.ts`     | Contact details, social links, WhatsApp number |
| `schedule.ts` | Weekly class schedule & booking dropdown       |
| `benefits.ts` | "Why messy play" cards & studio commitments    |
| `gallery.ts`  | Gallery image URLs & captions                  |
| `faqs.ts`     | FAQ questions & answers                        |

---

## ⚙️ Configuration (before going live)

Bookings go straight to **WhatsApp** — no backend, API keys, or email service required.
When a visitor submits the booking form, WhatsApp opens with their details pre-filled,
ready to send to the studio.

Set the destination number in [`src/data/site.ts`](./src/data/site.ts) (international
format, no `+` or spaces):

```ts
whatsappNumber: '27825791653',
```

---

## 🌍 Deployment (GitHub Pages)

Deployment is automated by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. **One-time:** in the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
2. **Deploy:** push to `main`. The Action runs `npm ci` → `npm run build` and publishes `dist/`.
3. **Watch:** the **Actions** tab shows progress; the live URL appears on the `deploy` job and in **Settings → Pages**.

You push **source only** — `dist/` is built on GitHub's runners and is gitignored.

### Custom domain

`public/CNAME` contains `squishsquashstudios.co.za`, so the domain survives every deploy.
To finish hooking it up:

- Point DNS at GitHub Pages (apex `A` records `185.199.108–111.153`, or a `CNAME` to
  `<username>.github.io`).
- In **Settings → Pages**, set the custom domain and enable **Enforce HTTPS**.

The build uses a relative `base`, so it works at both the project subpath
(`https://<username>.github.io/squish_squash_studios.github/`) and the custom domain.

---

<div align="center">

Made with 💕 for happy kids in Durbanville.

</div>
