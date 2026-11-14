// Shared helpers for the /unfiltered photo posts
import { getCollection } from 'astro:content';

export const kinds = {
  food: { emoji: '🍳', label: 'Food' },
  travel: { emoji: '🧭', label: 'Travel' },
  daily: { emoji: '☕', label: 'Daily' },
} as const;

/** Published posts, newest first. */
export async function unfilteredPosts() {
  return (await getCollection('unfiltered', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

export const longDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
