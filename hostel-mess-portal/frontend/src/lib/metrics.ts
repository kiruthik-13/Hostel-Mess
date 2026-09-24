import type { FeedbackReview, MealSlot } from '../types';
import type { TimeframeKey } from '../context/AppContext';
import { COMPLAINT_TAGS } from '../data/seed';

const slotOrder: MealSlot[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
const slotLabel: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
};

export function inTimeframe(dateStr: string, tf: TimeframeKey): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  if (tf === 'semester') {
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 120);
    return d >= cutoff;
  }
  if (tf === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);
  return d >= cutoff;
}

export function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function overallRating(reviews: FeedbackReview[], tf: TimeframeKey): number {
  const subset = reviews.filter((r) => inTimeframe(r.date, tf));
  return avg(subset.map((r) => r.rating));
}

export function totalReviews(reviews: FeedbackReview[], tf: TimeframeKey): number {
  return reviews.filter((r) => inTimeframe(r.date, tf)).length;
}

export function slotAverages(reviews: FeedbackReview[], tf: TimeframeKey) {
  return slotOrder.map((slot) => ({
    slot,
    label: slotLabel[slot],
    value: avg(
      reviews
        .filter((r) => inTimeframe(r.date, tf) && r.slot === slot)
        .map((r) => r.rating),
    ),
  }));
}

export interface DishScore {
  name: string;
  slot: MealSlot;
  count: number;
  value: number;
}

export function dishLeaderboard(reviews: FeedbackReview[], tf: TimeframeKey): DishScore[] {
  const map = new Map<string, { name: string; slot: MealSlot; ratings: number[] }>();
  for (const r of reviews) {
    if (!inTimeframe(r.date, tf)) continue;
    const entry = map.get(r.mealItem);
    if (entry) entry.ratings.push(r.rating);
    else map.set(r.mealItem, { name: r.mealItem, slot: r.slot, ratings: [r.rating] });
  }
  return Array.from(map.values())
    .filter((v) => v.ratings.length > 0)
    .map((v) => ({ name: v.name, slot: v.slot, count: v.ratings.length, value: avg(v.ratings) }))
    .sort((a, b) => b.value - a.value);
}

export function bestRated(reviews: FeedbackReview[], tf: TimeframeKey): DishScore | null {
  return dishLeaderboard(reviews, tf)[0] ?? null;
}

export function worstRated(reviews: FeedbackReview[], tf: TimeframeKey): DishScore | null {
  const list = dishLeaderboard(reviews, tf);
  return list[list.length - 1] ?? null;
}

export function tagCounts(reviews: FeedbackReview[], tf: TimeframeKey) {
  const live = new Map<string, number>();
  for (const r of reviews) {
    if (!inTimeframe(r.date, tf)) continue;
    for (const t of r.tags) live.set(t, (live.get(t) ?? 0) + 1);
  }
  return COMPLAINT_TAGS.map((c) => ({
    tag: c.tag,
    count: c.count + (live.get(c.tag) ?? 0),
  })).sort((a, b) => b.count - a.count);
}

export function matchesTag(review: FeedbackReview, tag: string | null): boolean {
  if (!tag) return true;
  const normalized = tag.replace(/^#/, '').toLowerCase();
  return (
    review.tags.some((t) => t.replace(/^#/, '').toLowerCase() === normalized) ||
    review.comment.toLowerCase().includes(normalized)
  );
}

export type { MealSlot };