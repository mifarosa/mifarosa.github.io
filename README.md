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
| CV content (summary, experience, skills, education) | `src/data/profile.ts` |
| Projects (one Markdown file each) | `src/content/projects/` |
| Blog posts (one Markdown file each) | `src/content/blog/` |
| Shared layout, nav, footer | `src/layouts/`, `src/components/` |
| Colors and fonts | `src/styles/global.css` |
| Static files (CV PDF, favicon, CNAME) | `public/` |

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

## Deployment

Every push to `main` builds the site and deploys it with GitHub Actions (`.github/workflows/deploy.yml`).
