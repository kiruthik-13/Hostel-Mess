import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Meal, MealSlot } from '../types';
import { FEEDBACK_QUICK_TAGS, MEAL_SLOT_META } from '../data/seed';
import Icon from './Icon';
import StarRating from './StarRating';
import { Modal } from './ui';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

export default function FeedbackModal() {
  const { menu, feedbackTarget, closeModal, addReview, showSuccess, user, isAuthed } = useApp();

  const initialDayId = feedbackTarget?.dayId ?? menu[0]?.id ?? '';
  const initialSlot = feedbackTarget?.meal.slot ?? 'breakfast';

  const [dayId, setDayId] = useState(initialDayId);
  const [slot, setSlot] = useState<MealSlot>(initialSlot);
  const [dishId, setDishId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const day = menu.find((d) => d.id === dayId);
  const meal: Meal | undefined = day?.meals.find((m) => m.slot === slot);

  const selectedDish = useMemo(
    () => meal?.dishes.find((d) => d.id === dishId),
    [meal, dishId],
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const resetForMeal = (nextDayId: string, nextSlot: MealSlot) => {
    setDayId(nextDayId);
    setSlot(nextSlot);
    setDishId('');
  };

  const submit = () => {
    if (!selectedDish) {
      setError('Please select the dish you ate from this meal.');
      return;
    }
    if (rating === 0) {
      setError('Please tap a star rating before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);
    setTimeout(() => {
      addReview({
        studentName: user?.name ?? 'You',
        studentId: user?.studentId ?? 'STU000',
        block: user?.block ?? 'Block A · North Campus',
        dish: selectedDish.name,
        slot,
        rating,
        comment,
        tags: selectedTags,
      });
      setSubmitting(false);
      closeModal();
      showSuccess(
        'Feedback submitted!',
        `Your ${rating}-star rating for ${selectedDish.name} was recorded and the dashboard updated instantly.`,
      );
    }, 700);
  };

  const meta = MEAL_SLOT_META[slot];

  return (
    <Modal
      title="Rate this Meal"
      subtitle={meal ? `${day?.weekday}, ${day?.monthDay} ${day?.month} · ${meal.location}` : 'Share your dining experience'}
      onClose={closeModal}
      icon="restaurant"
      wide
    >
      {/* Meal heading */}
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-md3 bg-surface-low px-4 py-3">
        <span className="md-tag">{meta.tag}</span>
        <span className="text-sm font-bold text-ink">{meal?.title ?? '—'}</span>
        <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
          <Icon name="schedule" size={14} />
          {meal?.schedule ?? meta.schedule}
        </span>
      </div>

      {/* Meal / dish picker when opened standalone */}
      {!feedbackTarget && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="md-label" htmlFor="fb-day">Meal day</label>
            <select id="fb-day" className="md-input" value={dayId} onChange={(e) => resetForMeal(e.target.value, slot)}>
              {menu.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.weekday}, {d.monthDay} {d.month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="md-label">Meal slot</label>
            <div className="flex flex-wrap gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => resetForMeal(dayId, s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    slot === s ? 'bg-primary text-on-primary' : 'bg-surface-default text-ink-soft hover:bg-surface-high'
                  }`}
                >
                  {MEAL_SLOT_META[s].title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dish dropdown */}
      <div className="mb-4">
        <label className="md-label" htmlFor="fb-dish">Which dish did you eat?</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
            <Icon name="ramen_dining" size={18} />
          </span>
          <select
            id="fb-dish"
            className="md-input appearance-none pl-11"
            value={dishId}
            onChange={(e) => setDishId(e.target.value)}
          >
            <option value="">Select a dish…</option>
            {meal?.dishes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.calories} kcal
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Star rating */}
      <div className="mb-4 rounded-md3 bg-surface-low px-4 py-4">
        <p className="mb-2 text-sm font-semibold text-ink">
          How was it? <span className="font-normal text-ink-soft">Tap a star to rate.</span>
        </p>
        <StarRating value={rating} onChange={setRating} interactive size={34} />
        {rating > 0 && (
          <p className="mt-1.5 text-xs font-bold text-primary">
            {rating <= 2 ? 'Not great — flagged for the warden.' : rating === 3 ? 'Decent, room to improve.' : 'Glad you enjoyed it!'}
          </p>
        )}
      </div>

      {/* Quick tags */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-ink">Quick feedback</label>
        <div className="flex flex-wrap gap-1.5">
          {FEEDBACK_QUICK_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-strong/40 bg-surface-lowest text-ink-soft hover:border-primary/60'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-2">
        <label className="md-label" htmlFor="fb-comment">Detailed comments <span className="font-normal text-ink-soft/70">(optional)</span></label>
        <textarea
          id="fb-comment"
          className="md-input min-h-24 resize-y"
          maxLength={500}
          placeholder="Tell the mess team about texture, taste, temperature, service…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <p className="mt-1 text-right text-xs text-ink-soft">{comment.length}/500</p>
      </div>

      {error && (
        <p className="mb-3 rounded-full bg-error-container px-4 py-2 text-sm font-semibold text-on-error-container">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center justify-end gap-3">
        <button onClick={closeModal} className="md-btn-secondary">Cancel</button>
        <button onClick={submit} disabled={submitting} className="md-btn-primary">
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
              Submitting…
            </>
          ) : (
            <>
              <Icon name="send" size={17} filled />
              Submit Feedback
            </>
          )}
        </button>
      </div>

      {!isAuthed && (
        <p className="mt-3 text-center text-xs text-ink-soft">
          You are reviewing anonymously — sign in from the profile menu to track history.
        </p>
      )}
    </Modal>
  );
}