import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ReviewStatus } from '../types';
import { MEAL_SLOT_META } from '../data/seed';
import Icon from './Icon';
import StarRating from './StarRating';
import { Badge, Modal } from './ui';

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'Pending review',
  reviewed: 'Reviewed',
  resolved: 'Resolved',
};

export default function FeedbackDetailModal() {
  const { isWarden, detailReview, closeModal, setReviewResolution, showSuccess } = useApp();
  const [reply, setReply] = useState(detailReview?.adminReply ?? '');
  const [status, setStatus] = useState<ReviewStatus>(detailReview?.status ?? 'pending');

  if (!detailReview) return null;

  const r = detailReview;
  const meta = MEAL_SLOT_META[r.slot];

  const saveResolution = () => {
    setReviewResolution(r.id, status, reply.trim() || (status === 'pending' ? null : reply.trim() || null));
    showSuccess('Resolution saved', `Official status for this review is now "${STATUS_LABEL[status]}".`);
    closeModal();
  };

  return (
    <Modal title="Feedback Details" subtitle={`By ${r.student} · ${r.block}`} onClose={closeModal} icon="rate_review" wide>
      <div className="grid gap-5 md:grid-cols-[1fr_220px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="md-tag">{meta.title}</span>
            <Badge color={r.status === 'resolved' ? 'secondary' : r.status === 'reviewed' ? 'primary' : 'error'}>
              {STATUS_LABEL[r.status]}
            </Badge>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold text-ink">{r.mealItem}</h3>
          <div className="mt-2 flex items-center gap-2">
            <StarRating value={r.rating} size={20} />
            <span className="text-sm font-bold text-ink">{r.rating.toFixed(1)} / 5</span>
          </div>

          <p className="mt-4 rounded-md3 bg-surface-low px-4 py-3 text-sm leading-relaxed text-ink">
            “{r.comment || 'No written comments.'}”
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {r.tags.map((t) => (
              <span key={t} className="rounded-full bg-primary-container/15 px-2.5 py-1 text-xs font-semibold text-on-primary-container">
                {t}
              </span>
            ))}
          </div>

          {r.adminReply && (
            <div className="mt-5 rounded-md3 border border-secondary-container bg-secondary-container/20 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-on-secondary-container">
                <Icon name="verified" size={16} filled />
                Official response from Mess Administration
              </p>
              <p className="mt-2 text-sm text-on-secondary-container/90">{r.adminReply}</p>
              {r.repliedAt && <p className="mt-2 text-xs text-on-secondary-container/60">Replied on {r.repliedAt}</p>}
            </div>
          )}

          {!isWarden && !r.adminReply && (
            <p className="mt-4 flex items-center gap-2 rounded-full bg-surface-high px-4 py-2.5 text-sm font-semibold text-ink-soft">
              <Icon name="hourglass" size={16} />
              No official response yet — the mess warden reviews every submission.
            </p>
          )}
        </div>

        {/* Meta column */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <div className="rounded-md3 bg-surface-low px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Hostel Block</p>
              <p className="mt-1 text-sm font-bold text-ink">{r.block}</p>
            </div>
            <div className="rounded-md3 bg-surface-low px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Submitted</p>
              <p className="mt-1 text-sm font-bold text-ink">{r.date}</p>
              <p className="text-xs text-ink-soft">{r.time}</p>
            </div>
            <div className="rounded-md3 bg-surface-low px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Meal Slot</p>
              <p className="mt-1 text-sm font-bold text-ink">{meta.title} · {meta.schedule}</p>
            </div>
            <div className="rounded-md3 bg-surface-low px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Student ID</p>
              <p className="mt-1 text-sm font-bold text-ink">{r.studentId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warden resolution panel */}
      {isWarden && (
        <div className="mt-6 rounded-md3 border border-outline/70 bg-surface-low/60 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <Icon name="shield_person" size={17} filled className="text-primary" />
              Official Resolution
            </p>
            <div className="flex gap-1.5">
              {(['reviewed', 'resolved'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    status === s
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-default text-ink-soft hover:bg-surface-high'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {s === 'reviewed' ? <Icon name="visibility" size={14} /> : <Icon name="check_circle" size={14} />}
                    {s === 'reviewed' ? 'Reviewed' : 'Resolved'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="md-input min-h-20 resize-y"
            maxLength={500}
            placeholder='Write an official response, e.g. "Notified Head Chef Raman to recalibrate seasoning."'
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button onClick={saveResolution} className="md-btn-primary">
              <Icon name="save" size={17} />
              Save Resolution
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}