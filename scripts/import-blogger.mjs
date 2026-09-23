#!/usr/bin/env node
// Converts a Blogger backup (.xml) into Markdown posts for src/content/blog/.
//
// Usage:
//   node scripts/import-blogger.mjs <blog-backup.xml> [--images] [--lang tr] [--force]
//
//   --images   download images into public/blog/<slug>/ instead of linking to Blogger
//   --lang     language code written to every post's frontmatter (default: tr)
//   --force    overwrite posts that already exist
//   --blog-url old blog address, used to rebuild post URLs (default: https://www.mfgstudiosblog.com)
//
// Also writes scripts/blogger-redirects.csv (old URL -> new URL) for later use.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const IMAGE_DIR = path.join(ROOT, 'public/blog');
const SITE = 'https://mifarosa.com';

const KIND_POST = 'http://schemas.google.com/blogger/2008/kind#post';
const KIND_PREFIX = 'http://schemas.google.com/blogger/2008/kind#';

// ---------- CLI ----------
const args = process.argv.slice(2);
const xmlPath = args.find((a, i) => !a.startsWith('--') && !['--lang', '--blog-url'].includes(args[i - 1]));
const downloadImages = args.includes('--images');
const force = args.includes('--force');
const optValue = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const lang = optValue('--lang', 'tr');
const blogUrl = optValue('--blog-url', 'https://www.mfgstudiosblog.com').replace(/\/$/, '');

if (!xmlPath) {
  console.error('Usage: node scripts/import-blogger.mjs <blog-backup.xml> [--images] [--lang tr] [--force]');
  process.exit(1);
}

// ---------- Helpers ----------
const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const text = (v) => (v == null ? '' : typeof v === 'object' ? v['#text'] ?? '' : String(v));

const exists = (p) => access(p).then(() => true, () => false);

// Turkish-aware slug, used only when the post has no Blogger URL (e.g. drafts)
function slugify(s) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' };
  return s
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post';
}

// YAML-safe double-quoted string
const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`;

// Plain-text summary from HTML, for the description field
function summarize(html, max = 160) {
  const plain = html
    .replace(/<(script|style|pre|code|table)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

// ---------- HTML -> Markdown ----------
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});
turndown.use(gfm);

// Blogger wraps images in <div class="separator"><a href="full-size"><img></a></div>;
// keep just the image
turndown.addRule('bloggerImageLink', {
  filter: (node) =>
    node.nodeName === 'A' &&
    node.childNodes.length === 1 &&
    node.firstChild.nodeName === 'IMG',
  replacement: (_content, node) => {
    const img = node.firstChild;
    const alt = (img.getAttribute('alt') || '').replace(/[[\]]/g, '');
    // The link usually points at the full-size image; prefer it over the thumbnail
    const href = node.getAttribute('href') || '';
    const isImage = /googleusercontent\.com|bp\.blogspot\.com|\.(png|jpe?g|gif|webp)(\?|$)/i.test(href);
    return `![${alt}](${isImage ? href : img.getAttribute('src')})`;
  },
});

// Code pasted into <pre> (often with <br> or spans from syntax highlighters)
turndown.addRule('preBlock', {
  filter: (node) => node.nodeName === 'PRE',
  replacement: (_content, node) => {
    const code = node.textContent.replace(/\u00a0/g, ' ').replace(/\n+$/, '');
    const cls = (node.getAttribute('class') || '') + ' ' + (node.firstChild?.getAttribute?.('class') || '');
    const lang = (cls.match(/(?:lang(?:uage)?-|brush:\s*)([\w#+]+)/i) || [])[1] || '';
    return `\n\n\`\`\`${lang.toLowerCase()}\n${code}\n\`\`\`\n\n`;
  },
});

// Drop empty Blogger spacer divs and inline styles noise
turndown.remove(['script', 'style']);

function toMarkdown(html) {
  const cleaned = html
    .replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/gi, (_m, attrs, inner) =>
      `<pre${attrs}>${inner.replace(/<br\s*\/?>/gi, '\n')}</pre>`)
    .replace(/<div[^>]*>\s*(<br\s*\/?>)?\s*<\/div>/gi, '<br>');
  return turndown
    .turndown(cleaned)
    .replace(/^[ \t]+$/gm, '')          // whitespace-only lines left by <br>
    .replace(/^(\s*)([-*]|\d+\.)\s{2,}/gm, '$1$2 ')  // "-   item" -> "- item"
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ---------- Images ----------
async function localizeImages(markdown, slug) {
  const urls = [...new Set([...markdown.matchAll(/!\[[^\]]*\]\((\S+?)\)/g)].map((m) => m[1]))];
  if (!urls.length) return markdown;
  const dir = path.join(IMAGE_DIR, slug);
  await mkdir(dir, { recursive: true });

  let out = markdown;
  for (const [i, url] of urls.entries()) {
    try {
      // Ask Blogger's CDN for the original size where possible
      const full = url.replace(/\/s\d+(-[a-z0-9-]+)?\//i, '/s0/').replace(/=w\d+-h\d+[^/]*$/i, '=s0');
      const res = await fetch(full.startsWith('//') ? `https:${full}` : full);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      const ext = type.includes('png') ? 'png' : type.includes('gif') ? 'gif' : type.includes('webp') ? 'webp' : 'jpg';
      const file = `image-${i + 1}.${ext}`;
      await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
      out = out.split(url).join(`/blog/${slug}/${file}`);
    } catch (err) {
      console.warn(`  ! could not download image for ${slug}: ${url} (${err.message}); keeping remote link`);
    }
  }
  return out;
}

// ---------- Main ----------
const xml = await readFile(xmlPath, 'utf8');
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true,
  processEntities: true,
  htmlEntities: true,
});
const feed = parser.parse(xml).feed;
const entries = asArray(feed?.entry);

// Newer Blogger exports mark the kind with <blogger:type>; older ones with a category term
const kindOf = (e) => {
  if (e.type && typeof e.type === 'string') return e.type.toLowerCase();
  const kind = asArray(e.category).find((c) => c.scheme === 'http://schemas.google.com/g/2005#kind');
  return kind?.term?.startsWith(KIND_PREFIX) ? kind.term.slice(KIND_PREFIX.length) : '';
};
const isPost = (e) => kindOf(e) === 'post' || asArray(e.category).some((c) => c.term === KIND_POST);

const posts = entries.filter(isPost);
if (!posts.length) {
  console.error('No posts found. Is this a Blogger backup file (Settings > Manage blog > Back up content)?');
  process.exit(1);
}

await mkdir(BLOG_DIR, { recursive: true });
const redirects = [['old_url', 'new_url']];
const used = new Set();
let written = 0, skipped = 0, drafts = 0;

for (const e of posts) {
  const title = text(e.title).trim() || 'Untitled';
  const html = text(e.content);
  const published = text(e.published) || text(e.updated);
  const isDraft =
    String(e.control?.draft ?? '').toLowerCase() === 'yes' ||
    String(e.status ?? '').toUpperCase() === 'DRAFT';

  // Original URL: <link rel="alternate"> in old exports, <blogger:filename> in new ones
  const alt = asArray(e.link).find((l) => l.rel === 'alternate' && l.type === 'text/html');
  const filename = text(e.filename);
  const originalUrl = alt?.href || (filename ? `${blogUrl}${filename}` : '');
  const fromUrl = originalUrl.match(/\/([^/]+)\.html$/)?.[1];

  let slug = fromUrl || slugify(title);
  if (used.has(slug)) slug = `${slug}-${published.slice(0, 7)}`;
  used.add(slug);

  // Labels, cleaned and de-duplicated (case-insensitive)
  const tags = [...new Map(
    asArray(e.category)
      .filter((c) => c.scheme === 'http://www.blogger.com/atom/ns#' || (!c.scheme && c.term && !c.term.startsWith('http')))
      .map((c) => c.term.trim().replace(/[.!]+$/, ''))
      .filter(Boolean)
      .map((t) => [t.toLocaleLowerCase('tr'), t.toLocaleLowerCase('tr')])
  ).values()];

  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!force && (await exists(file))) { skipped++; continue; }

  let body = toMarkdown(html);
  if (downloadImages) body = await localizeImages(body, slug);

  const front = [
    '---',
    `title: ${q(title)}`,
    `description: ${q(summarize(html) || title)}`,
    `date: ${published.slice(0, 10)}`,
    `tags: [${tags.map(q).join(', ')}]`,
    `lang: ${lang}`,
    ...(originalUrl ? [`originalUrl: ${q(originalUrl)}`] : []),
    ...(isDraft ? ['draft: true'] : []),
    '---',
    '',
  ].join('\n');

  await writeFile(file, front + body + '\n', 'utf8');
  written++;
  if (isDraft) drafts++;
  if (originalUrl && !isDraft) redirects.push([originalUrl, `${SITE}/blog/${slug}`]);
  console.log(`  ✓ ${slug}${isDraft ? ' (draft)' : ''}`);
}

await writeFile(path.join(ROOT, 'scripts/blogger-redirects.csv'), redirects.map((r) => r.join(',')).join('\n') + '\n');

console.log(`\nDone: ${written} written (${drafts} drafts), ${skipped} skipped because they already exist.`);
console.log('Old URL -> new URL list: scripts/blogger-redirects.csv');
