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

export const collections = { projects, blog };
