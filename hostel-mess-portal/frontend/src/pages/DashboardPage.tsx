import { useEffect, useMemo } from 'react';
import { useApp, type TimeframeKey } from '../context/AppContext';
import type { FeedbackReview, MealSlot } from '../types';
import {
  bestRated,
  inTimeframe,
  matchesTag,
  overallRating,
  slotAverages,
  tagCounts,
  totalReviews,
  worstRated,
} from '../lib/metrics';
import { MEAL_SLOT_META } from '../data/seed';
import Icon from '../components/Icon';
import StarRating from '../components/StarRating';
import { Badge, EmptyState, KpiCard, ProgressBar, SectionTitle } from '../components/ui';

const TIMEFRAMES: { key: TimeframeKey; label: string }[] = [
  { key: '7d', label: 'Last 7 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'semester', label: 'Semester' },
];

const SLOT_COLOR: Record<MealSlot, string> = {
  breakfast: '#f97316',
  lunch: '#9d4300',
  snacks: '#006c4a',
  dinner: '#8c7164',
};

const PAGE_SIZE = 6;

function exportCsv(reviews: FeedbackReview[]) {
  const header = ['Student', 'Student ID', 'Block', 'Meal Slot', 'Meal Item', 'Rating', 'Comment', 'Date', 'Time', 'Status', 'Tags'];
  const rows = reviews.map((r) =>
    [r.student, r.studentId, r.block, r.slot, r.mealItem, r.rating, r.comment, r.date, r.time, r.status, r.tags.join(';')]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  );
  const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campusbite-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const {
    reviews,
    isWarden,
    timeframe,
    setTimeframe,
    tableSearch,
    setTableSearch,
    slotFilter,
    setSlotFilter,
    ratingFilter,
    setRatingFilter,
    activeTag,
    setActiveTag,
    page,
    setPage,
    openDetailModal,
    showSuccess,
  } = useApp();

  const overall = overallRating(reviews, timeframe);
  const total = totalReviews(reviews, timeframe);
  const best = bestRated(reviews, timeframe);
  const worst = worstRated(reviews, timeframe);
  const slots = slotAverages(reviews, timeframe);
  const tags = tagCounts(reviews, timeframe);

  const filtered = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    return reviews.filter((r) => {
      if (!inTimeframe(r.date, timeframe)) return false;
      if (slotFilter && r.slot !== slotFilter) return false;
      if (ratingFilter !== '' && r.rating !== Number(ratingFilter)) return false;
      if (!matchesTag(r, activeTag)) return false;
      if (!q) return true;
      return (
        r.student.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.mealItem.toLowerCase().includes(q)
      );
    });
  }, [reviews, timeframe, slotFilter, ratingFilter, activeTag, tableSearch]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [timeframe, slotFilter, ratingFilter, activeTag, tableSearch, setPage]);

  const handleExport = () => {
    exportCsv(filtered);
    showSuccess('Report exported', `Downloaded ${filtered.length} feedback row${filtered.length === 1 ? '' : 's'} as CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading text-3xl">Dining Analytics</h1>
          <p className="mt-1 text-ink-soft">Live averages, complaint trends and every raw review — updated instantly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full bg-surface-default p-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  timeframe === tf.key ? 'bg-primary text-on-primary shadow-md3' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <button onClick={handleExport} className="md-btn-secondary">
            <Icon name="download" size={17} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI bento */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon="star"
          label="Overall Mess Rating"
          value={
            <span className="flex items-center gap-2">
              {overall.toFixed(1)}
              <span className="text-base font-semibold text-ink-soft">/ 5.0</span>
            </span>
          }
          sub={<StarRating value={Math.round(overall)} size={15} />}
          trend={{ label: '+0.3 vs last week', up: true }}
        />
        <KpiCard
          icon="rate_review"
          label="Total Reviews"
          value={<span className="font-display">{total.toLocaleString()}</span>}
          sub={
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              84% active student participation
            </span>
          }
          accent="#006c4a"
        />
        <KpiCard
          icon="emoji_food_beverage"
          label="Best Rated Meal"
          value={<span className="truncate text-xl">{best ? best.name : '—'}</span>}
          sub={best ? <StarRating value={Math.round(best.value)} size={15} /> : <span>No data</span>}
          trend={{ label: `${best ? best.value.toFixed(1) : '0.0'} avg`, up: true }}
          accent="#006c4a"
        />
        <KpiCard
          icon="priority_high"
          label="Lowest Rated Meal"
          value={<span className="truncate text-xl">{worst ? worst.name : '—'}</span>}
          sub={worst ? <StarRating value={Math.round(worst.value)} size={15} /> : <span>No data</span>}
          trend={{ label: `${worst ? worst.value.toFixed(1) : '0.0'} avg · action recommended`, up: false }}
          accent="#ba1a1a"
        />
      </div>

      {/* Bento visual row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Meal-type bars */}
        <div className="md-card p-5">
          <SectionTitle icon="bar_chart" title="Average Rating by Meal Type" />
          <div className="space-y-4">
            {slots.map((s) => (
              <div key={s.slot}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-bold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SLOT_COLOR[s.slot] }} />
                    {s.label}
                  </span>
                  <span className="font-bold text-ink">{s.value ? s.value.toFixed(1) : '—'} / 5</span>
                </div>
                <ProgressBar value={s.value} max={5} color={SLOT_COLOR[s.slot]} />
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-full bg-surface-low px-4 py-2 text-xs font-semibold text-ink-soft">
            Dinner lags the most — {tags.find((t) => t.tag === '#LateService')?.count ?? 0} late-service reports
            need attention.
          </p>
        </div>

        {/* Complaint tag cloud */}
        <div className="md-card p-5">
          <SectionTitle
            icon="whatshot"
            title="Complaint Tag Cloud"
            action={
              activeTag && (
                <button onClick={() => setActiveTag(null)} className="md-btn-ghost px-3 py-1 text-xs">
                  Clear filter
                </button>
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const active = activeTag === t.tag;
              const fontWeight = 400 + Math.round((t.count / tags[0].count) * 300);
              return (
                <button
                  key={t.tag}
                  onClick={() => setActiveTag(active ? null : t.tag)}
                  className={`rounded-full px-3.5 py-2 text-sm transition ${
                    active
                      ? 'bg-primary text-on-primary shadow-md3'
                      : 'bg-primary-container/10 text-on-primary-container hover:bg-primary-container/25'
                  }`}
                  style={active ? undefined : { fontWeight }}
                >
                  {t.tag}
                  <span className={`ml-1.5 text-xs font-bold ${active ? 'text-on-primary/80' : 'text-ink-soft'}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 rounded-full bg-surface-low px-4 py-2 text-xs font-semibold text-ink-soft">
            Tap a tag to filter the raw feedback table below ({filtered.length} rows match).
          </p>
        </div>
      </div>

      {/* Raw feedback explorer */}
      <div className="md-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline/60 px-5 py-4">
          <h3 className="heading flex items-center gap-2 text-lg">
            <Icon name="table_rows" size={20} className="text-primary" />
            Raw Feedback Explorer
          </h3>
          {!isWarden && (
            <Badge color="neutral">
              <Icon name="lock" size={13} />
              Warden-only actions hidden
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="grid gap-3 border-b border-outline/60 bg-surface-low/40 px-5 py-4 md:grid-cols-[1fr_160px_160px]">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
              <Icon name="search" size={18} />
            </span>
            <input
              className="md-input pl-10"
              placeholder="Search student names, IDs or comments…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              aria-label="Search feedback"
            />
          </div>
          <select className="md-input" value={slotFilter} onChange={(e) => setSlotFilter(e.target.value as '' | MealSlot)} aria-label="Filter by meal slot">
            <option value="">All meal slots</option>
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealSlot[]).map((s) => (
              <option key={s} value={s}>{MEAL_SLOT_META[s].title}</option>
            ))}
          </select>
          <select className="md-input" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value === '' ? '' : Number(e.target.value))} aria-label="Filter by star rating">
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {paged.length === 0 ? (
          <div className="p-5">
            <EmptyState icon="inbox" title="No feedback matches these filters" hint="Try clearing search, ratings or a tag filter." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline/60 bg-surface-low text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3 font-bold">Student</th>
                  <th className="px-4 py-3 font-bold">Meal Item</th>
                  <th className="px-4 py-3 font-bold">Rating</th>
                  <th className="px-4 py-3 font-bold">Comment</th>
                  <th className="px-4 py-3 font-bold">Date / Time</th>
                  <th className="px-4 py-3 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr key={r.id} className="border-b border-outline/40 transition last:border-0 hover:bg-surface-low/60">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-ink">{r.student}</p>
                      <p className="text-xs text-ink-soft">
                        {r.studentId} · {r.block}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-surface-default text-ink">{MEAL_SLOT_META[r.slot].title}</span>
                      <p className="mt-1 font-semibold text-ink">{r.mealItem}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StarRating value={r.rating} size={15} />
                      <p className="mt-0.5 text-xs font-bold text-ink-soft">{r.rating.toFixed(1)}</p>
                    </td>
                    <td className="max-w-64 px-4 py-3.5">
                      <p className="line-clamp-2 text-ink-soft">{r.comment || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-ink-soft">
                      {r.date}
                      <br />
                      <span className="text-xs">{r.time}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => openDetailModal(r.id)}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary-container/15"
                        aria-label={`View details for ${r.student}'s review`}
                      >
                        <Icon name="visibility" size={17} filled={false} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline/60 px-5 py-4">
          <p className="text-xs font-semibold text-ink-soft">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} reviews
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage <= 1}
              className="md-btn-secondary px-4 py-2 text-xs"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === pageCount || Math.abs(n - safePage) <= 1)
              .map((n, idx, arr) => (
                <span key={n} className="flex items-center gap-1">
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span className="px-1 text-ink-soft">…</span>}
                  <button
                    onClick={() => setPage(n)}
                    className={`h-9 w-9 rounded-full text-sm font-bold transition ${
                      n === safePage ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-surface-default'
                    }`}
                  >
                    {n}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount}
              className="md-btn-secondary px-4 py-2 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}