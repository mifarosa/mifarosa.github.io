import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each project is one Markdown file in src/content/projects/
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    period: z.string(),
    status: z.enum(['Active', 'Beta', 'Released', 'Archived']),
    tags: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    icon: z.string().optional(),               // app icon under public/, shown in Apps
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

// Each browser game is one Markdown file in src/content/games/
const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    play: z.string().url(),                    // where the game runs
    repo: z.string().url().optional(),
    icon: z.string().optional(),               // square icon under public/
    cover: z.string().optional(),              // 16:9 screenshot under public/
    tags: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

// Blog posts live in src/content/blog/; drafts are hidden from the site
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.string().default('en'),            // 'tr' for Turkish posts
    originalUrl: z.string().url().optional(),  // where the post was first published
  }),
});

// Unfiltered photo posts (food, travel, daily life) live in src/content/unfiltered/; the body is the caption
const unfiltered = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/unfiltered' }),
  schema: z.object({
    date: z.coerce.date(),
    photos: z.array(z.object({ src: z.string(), alt: z.string().optional() })).min(1), // first one is the grid thumbnail
    place: z.string().optional(),
    kind: z.enum(['food', 'travel', 'daily']).default('daily'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, games, blog, unfiltered };
