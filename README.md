# milindyadav engineering portfolio

A static portfolio built with Next.js and configured for free hosting on GitHub Pages.

## How the website works

- `app/page.tsx` contains the page content and structure.
- `app/BookCarousel.tsx` contains the reading-notes carousel.
- `app/ThemeToggle.tsx` controls the light and dark theme preference.
- `app/globals.css` controls the visual design and responsive layout.
- `app/layout.tsx` contains the browser title and search-engine description.
- `public/` is where downloadable files and images belong.
- `.github/workflows/deploy-pages.yml` automatically publishes the site after a push to `main`.
- `next.config.ts` tells Next.js to generate plain static files in `out/`.

## Run it on your computer

Install Node.js 24 LTS, then run:

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. Press `Ctrl+C` to stop it.

## Publish with GitHub Pages

1. Create a public GitHub repository named `milindyadav`.
2. Add this project to that repository and push the `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Open the **Actions** tab and wait for the deployment workflow to finish.
6. Visit `https://<your-github-username>.github.io/milindyadav/`.

Without a custom domain, a project Pages address includes the GitHub account
name. The repository and website identity can still be `milindyadav`. If the
GitHub account itself is named `milindyadav`, you can instead use a repository
named `milindyadav.github.io` and publish at the root address.

Every later push to `main` automatically rebuilds and republishes the website.

## Build the static files manually

```bash
GITHUB_PAGES_BUILD=true NEXT_PUBLIC_BASE_PATH=/milindyadav npx next build
```

The deployable website is generated inside `out/`.
