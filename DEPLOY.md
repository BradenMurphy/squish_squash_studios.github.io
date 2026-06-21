# Deploying

The site is a Vite + React app hosted on **GitHub Pages** at **www.squishsquash.co.za**.

## Deploy (the normal way)

Just push to `main` — GitHub Actions builds and publishes automatically:

```bash
git add .
git commit -m "Your change"
git push origin main
```

Watch the run under the repo's **Actions** tab. It's live in ~1–2 minutes.

> Prefer not to push? Go to **Actions → Deploy to GitHub Pages → Run workflow** to trigger it manually.

## Local commands

```bash
npm install      # first time only
npm run dev      # local dev server (hot reload)
npm run build    # type-check + production build into dist/
npm run preview  # serve the built dist/ locally to verify
```

## Notes

- **The build runs in GitHub Actions, not on your machine.** CI runs `npm run build` in the cloud and publishes the result — you just push source. The `dist/` folder is gitignored and never committed.
- Running `npm run build` locally is optional — handy only to catch type errors before pushing (CI fails on them too).
- The custom domain is set by the `CNAME` file — don't delete it.
