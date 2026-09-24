import { useApp } from '../context/AppContext';
import type { FeedbackReview } from '../types';
import { MEAL_SLOT_META } from '../data/seed';
import Icon from '../components/Icon';
import StarRating from '../components/StarRating';
import { Badge, EmptyState, SectionTitle } from '../components/ui';

const STATUS_LABEL: Record<FeedbackReview['status'], { text: string; color: 'primary' | 'secondary' | 'error' }> = {
  pending: { text: 'Pending review', color: 'error' },
  reviewed: { text: 'Reviewed', color: 'primary' },
  resolved: { text: 'Resolved', color: 'secondary' },
};

export default function FeedbackPage() {
  const { user, reviews, isWarden, openDetailModal, openModal } = useApp();

  const myReviews = isWarden
    ? reviews
    : reviews.filter(
        (r) => r.studentId === user?.studentId || r.block.startsWith(user?.block.split(' · ')[0] ?? 'BLk-NONE'),
      );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading text-3xl">{isWarden ? 'All Student Feedback' : 'My Feedback'}</h1>
          <p className="mt-1 text-ink-soft">
            {isWarden
              ? 'Every submission from hostel residents, with warden resolution status.'
              : 'Your submitted reviews and their official resolution status.'}
          </p>
        </div>
        <button onClick={() => openModal('feedback')} className="md-btn-primary">
          <Icon name="add" size={18} filled />
          New Feedback
        </button>
      </div>

      <SectionTitle
        icon="rate_review"
        title={`${myReviews.length} submission${myReviews.length === 1 ? '' : 's'}`}
        action={
          <Badge color="neutral">
            <Icon name="verified_user" size={13} />
            Anonymous to kitchen staff
          </Badge>
        }
      />

      {myReviews.length === 0 ? (
        <EmptyState
          icon="reviews"
          title="No feedback yet"
          hint="Tap below to share your first rating on a meal you’ve tried this week."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myReviews.map((r) => {
            const meta = MEAL_SLOT_META[r.slot];
            const status = STATUS_LABEL[r.status];
            return (
              <button
                key={r.id}
                onClick={() => openDetailModal(r.id)}
                className="group md-card p-5 text-left transition hover:border-primary/40 hover:shadow-md3-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="md-tag">{meta.title}</span>
                  <Badge color={status.color}>{status.text}</Badge>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="heading text-lg">{r.mealItem}</p>
                  <StarRating value={r.rating} size={18} />
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  {r.comment || 'No written comments.'}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {r.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-surface-default px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-outline/60 pt-3 text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="calendar_today" size={13} />
                    {r.date}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-primary opacity-0 transition group-hover:opacity-100">
                    View details <Icon name="chevron_right" size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => openModal('feedback')}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-md3-fab transition hover:bg-on-primary-container hover:scale-105"
        aria-label="Rate a meal"
      >
        <Icon name="edit" size={24} filled />
      </button>
    </div>
  );
}