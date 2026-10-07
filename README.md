# mifarosa.com

Personal website of Mehmet Faruk Gül, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Where things live

| What | Where |
| --- | --- |
| CV content (summary, experience, skills, education) | `src/data/profile.json` (or edit it in `/admin/cms/`) |
| Projects (one Markdown file each) | `src/content/projects/` |
| Blog posts (one Markdown file each) | `src/content/blog/` |
| Page layout (sidebar, theme toggle) | `src/layouts/BaseLayout.astro` |
| Reusable pieces (project item, section title) | `src/components/` |
| Colours, fonts, light and dark themes | `src/styles/global.css` |
| Static files (CV PDF, favicon, CNAME) | `public/` |
| Admin panel, content editor, admin worker | `src/pages/admin/`, `worker/` |

### Add a project

Create `src/content/projects/<name>.md`:

```markdown
---
title: My Project
subtitle: One-line description
period: Oct 2026
status: Active        # Active | Beta | Released | Archived
tags: [Java, Spring Boot]
repo: https://github.com/mifarosa/my-project
demo: https://example.com   # optional
featured: true              # show on the home page
order: 4                    # lower comes first
---
What it does, in a short paragraph or two.
```

### Add a blog post

Create `src/content/blog/<slug>.md` with `title`, `description` and `date` in the frontmatter. Posts with `draft: true` are not published.

### Import posts from Blogger

1. In Blogger: **Settings → Manage blog → Back up content → Download**. This gives an `.xml` file.
2. Run:

   ```bash
   npm run import:blogger -- path/to/blog-backup.xml --images
   ```

   - `--images` downloads images into `public/blog/<slug>/` so posts no longer depend on Blogger. Leave it out to keep linking to Blogger's image servers.
   - `--lang tr` (default) marks posts as Turkish; `--force` overwrites posts that were already imported.
3. Review the generated files in `src/content/blog/`, delete `hello-world.md`, then run `npm run dev` and check a few posts.

Drafts are imported with `draft: true` and stay hidden. Static pages and comments are skipped. The script also writes `scripts/blogger-redirects.csv` with each old post URL and its new address.

## Admin

`/admin` is a private panel (not linked, not indexed). Only the `mifarosa` GitHub account can sign in. It has:

- **İstatistikler**: visitors, pages, clicks, referrers and more from [GoatCounter](https://mifarosa.goatcounter.com).
- **Blog yazıları**: every post with its read count.
- **İçerik düzenle** (`/admin/cms/`): [Sveltia CMS](https://github.com/sveltia/sveltia-cms) for blog posts, projects and the profile/CV (`src/data/profile.json`). Each save is a commit to `main`, which deploys the site.

Sign-in and the stats go through a small Cloudflare Worker in `worker/`. It does the GitHub OAuth exchange and keeps the GoatCounter API key. Visits are counted on the live site only.

### One-time setup

The worker is deployed by Cloudflare Workers Builds, which is connected to this repository.

1. **Worker build settings** (Cloudflare → Workers → `fancy-wildflower-a41a` → Settings → Build): root directory `worker`, empty build command, deploy command `npx wrangler deploy`. Its address is `https://fancy-wildflower-a41a.m-farukgul.workers.dev`, which is set as `adminApiUrl` in `src/data/analytics.ts`.
2. **GoatCounter**: create an API key with only **Read statistics**.
3. **GitHub OAuth app** (GitHub → Settings → Developer settings → OAuth Apps → New): homepage `https://mifarosa.com`, callback `https://fancy-wildflower-a41a.m-farukgul.workers.dev/callback`.
4. **Worker secrets** (Settings → Variables and Secrets, type *Secret*): `GOATCOUNTER_KEY`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (from the OAuth app).

### Google Analytics

Google Analytics 4 runs next to GoatCounter once `gaMeasurementId` in `src/data/analytics.ts` is set to the stream's Measurement ID (`G-…`). To get one, go to analytics.google.com → Admin → Create → Property, then add a **Web** data stream for `https://mifarosa.com`. GA uses Consent Mode: a cookie bar asks first, analytics cookies are only set after **Accept**, and ad signals are always off. Click events go to GA as `tracked_click` with the same names GoatCounter uses. The "don't count my visits" toggle in `/admin` turns GA off for that browser too. `/privacy` explains all of this to visitors.

## Deployment

Every push to `main` builds the site and deploys it with GitHub Actions (`.github/workflows/deploy.yml`).
