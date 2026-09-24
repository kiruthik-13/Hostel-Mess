import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Dish, MealSlot } from '../types';
import { MEAL_SLOT_META } from '../data/seed';
import Icon from '../components/Icon';
import { Badge, Chip } from '../components/ui';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

interface Draft {
  tag: string;
  schedule: string;
  location: string;
  dietary: string;
  dishes: Dish[];
}

const uid = () => `dish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function EditorPage() {
  const { menu, isWarden, switchRole, updateMeal, replaceMealDishes, showSuccess } = useApp();

  const [dayId, setDayId] = useState(() => menu.find((d) => d.isToday)?.id ?? menu[0]?.id ?? '');
  const [slot, setSlot] = useState<MealSlot>('breakfast');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [dirty, setDirty] = useState(false);

  const day = menu.find((d) => d.id === dayId);
  const meal = day?.meals.find((m) => m.slot === slot);

  useEffect(() => {
    if (!meal) return;
    setDraft({
      tag: meal.tag,
      schedule: meal.schedule,
      location: meal.location,
      dietary: meal.dietary,
      dishes: meal.dishes.map((d) => ({ ...d })),
    });
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId, slot]);

  /* ----- Warden gate ----- */
  if (!isWarden) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="md-card flex flex-col items-center px-8 py-14 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-error-container text-error">
            <Icon name="lock" size={40} filled />
          </span>
          <h1 className="heading mt-5 text-2xl">Warden access required</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            The Menu Editor lets wardens publish weekly menus and update dishes, timings and dietary markers.
            Students can only view published menus.
          </p>
          <button onClick={switchRole} className="md-btn-primary mt-6">
            <Icon name="swap_horiz" size={18} />
            Switch to Warden view
          </button>
        </div>
      </div>
    );
  }

  if (!draft || !meal || !day) return null;

  const patchDish = (id: string, patch: Partial<Dish>) => {
    setDraft((d) => d && { ...d, dishes: d.dishes.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
    setDirty(true);
  };

  const removeDish = (id: string) => {
    setDraft((d) => d && { ...d, dishes: d.dishes.filter((x) => x.id !== id) });
    setDirty(true);
  };

  const addDish = () => {
    setDraft((d) =>
      d && { ...d, dishes: [...d.dishes, { id: uid(), name: 'New Dish', calories: 300, description: 'Add a short description…' }] },
    );
    setDirty(true);
  };

  const publish = () => {
    if (!draft) return;
    updateMeal(dayId, slot, {
      tag: draft.tag.trim() || MEAL_SLOT_META[slot].tag,
      schedule: draft.schedule.trim() || MEAL_SLOT_META[slot].schedule,
      location: draft.location.trim() || 'Main Dining Hall',
      dietary: draft.dietary.trim() || 'Standard Meal',
    });
    replaceMealDishes(dayId, slot, draft.dishes);
    showSuccess('Menu published!', `${day.weekday} ${MEAL_SLOT_META[slot].title} is now live on the student menu.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading text-3xl">Menu Editor</h1>
          <p className="mt-1 text-ink-soft">Select a day and slot, fine-tune every dish, then publish to all students instantly.</p>
        </div>
        <Badge color="secondary">
          <Icon name="cloud_done" size={14} filled />
          Auto-published on save
        </Badge>
      </div>

      {/* Day + slot selectors */}
      <div className="md-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
            <Icon name="event" size={17} />
            Day
          </span>
          <div className="flex flex-1 flex-wrap gap-1.5">
            {menu.map((d) => (
              <Chip
                key={d.id}
                label={`${d.weekday} · ${d.monthDay}`}
                icon={d.isToday ? 'today' : undefined}
                active={dayId === d.id}
                onClick={() => setDayId(d.id)}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-outline/60 pt-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
            <Icon name="restaurant" size={17} />
            Slot
          </span>
          <div className="flex flex-1 flex-wrap gap-1.5">
            {SLOTS.map((s) => (
              <Chip
                key={s}
                label={MEAL_SLOT_META[s].title}
                icon={s === 'breakfast' ? 'wb_twilight' : s === 'dinner' ? 'nightlight' : 'lunch_dining'}
                active={slot === s}
                onClick={() => setSlot(s)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Editing card */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="md-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="heading flex items-center gap-2 text-lg">
              <Icon name="edit_note" size={20} className="text-primary" />
              Editing {MEAL_SLOT_META[slot].title} · {day.weekday}
            </h2>
            <span className="text-xs font-bold text-ink-soft">
              {draft.dishes.length} dish{draft.dishes.length === 1 ? '' : 'es'} · {draft.dishes.reduce((a, b) => a + b.calories, 0)} kcal total
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="md-label" htmlFor="ed-tag">Badge headline</label>
              <input id="ed-tag" className="md-input" value={draft.tag} onChange={(e) => { setDraft({ ...draft, tag: e.target.value }); setDirty(true); }} />
            </div>
            <div>
              <label className="md-label" htmlFor="ed-schedule">Service timing</label>
              <input id="ed-schedule" className="md-input" value={draft.schedule} onChange={(e) => { setDraft({ ...draft, schedule: e.target.value }); setDirty(true); }} />
            </div>
            <div>
              <label className="md-label" htmlFor="ed-location">Dining location</label>
              <input id="ed-location" className="md-input" value={draft.location} onChange={(e) => { setDraft({ ...draft, location: e.target.value }); setDirty(true); }} />
            </div>
            <div>
              <label className="md-label" htmlFor="ed-dietary">Dietary marker</label>
              <input id="ed-dietary" className="md-input" value={draft.dietary} onChange={(e) => { setDraft({ ...draft, dietary: e.target.value }); setDirty(true); }} />
            </div>
          </div>

          {/* Dish rows */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink">Dishes</p>
              <button onClick={addDish} className="md-btn-tonal px-3.5 py-2 text-xs">
                <Icon name="add" size={15} filled />
                Add dish
              </button>
            </div>
            {draft.dishes.map((d) => (
              <div key={d.id} className="rounded-md3 border border-outline/60 bg-surface-low/50 p-4">
                <div className="grid gap-3 md:grid-cols-[2fr_110px_auto]">
                  <div>
                    <label className="md-label">Dish name</label>
                    <input className="md-input" value={d.name} onChange={(e) => patchDish(d.id, { name: e.target.value })} />
                  </div>
                  <div>
                    <label className="md-label">Calories</label>
                    <input
                      className="md-input"
                      type="number"
                      min={0}
                      value={d.calories}
                      onChange={(e) => patchDish(d.id, { calories: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <button
                    onClick={() => removeDish(d.id)}
                    className="self-end rounded-full p-2.5 text-error transition hover:bg-error-container"
                    aria-label={`Remove ${d.name}`}
                  >
                    <Icon name="delete" size={19} />
                  </button>
                </div>
                <label className="md-label mt-3">Description / preparation notes</label>
                <textarea
                  className="md-input min-h-16 resize-y"
                  value={d.description}
                  onChange={(e) => patchDish(d.id, { description: e.target.value })}
                />
              </div>
            ))}
            {draft.dishes.length === 0 && (
              <p className="rounded-md3 border border-dashed border-outline-strong/40 px-4 py-6 text-center text-sm font-semibold text-ink-soft">
                No dishes in this slot yet — add one to keep the menu useful.
              </p>
            )}
          </div>
        </div>

        {/* Live preview + publish */}
        <div className="space-y-4">
          <div className="md-card p-5">
            <h3 className="heading flex items-center gap-2 text-base">
              <Icon name="visibility" size={18} className="text-primary" />
              Live preview
            </h3>
            <div className="mt-3 rounded-md3 bg-surface-low p-4">
              <span className="md-tag">{draft.tag || MEAL_SLOT_META[slot].tag}</span>
              <p className="mt-2 text-lg font-bold text-ink">{MEAL_SLOT_META[slot].title}</p>
              <p className="flex items-center gap-1 text-xs text-ink-soft">
                <Icon name="schedule" size={13} />
                {draft.schedule || MEAL_SLOT_META[slot].schedule}
              </p>
              <ul className="mt-3 space-y-1.5">
                {draft.dishes.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-semibold text-ink">{d.name || 'Unnamed dish'}</span>
                    <span className="shrink-0 rounded-full bg-primary-container/15 px-2 py-0.5 text-[11px] font-bold text-on-primary-container">
                      {d.calories} kcal
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-outline/60 pt-2 text-xs font-semibold text-ink-soft">{draft.dietary}</p>
            </div>
          </div>

          <div className="md-card p-5">
            <button onClick={publish} className="md-btn-primary w-full">
              <Icon name="publish" size={18} filled />
              Save & Publish Menu
            </button>
            {dirty && (
              <p className="mt-3 rounded-full bg-primary-container/15 px-4 py-2 text-center text-xs font-bold text-on-primary-container">
                Unsaved changes will be published now
              </p>
            )}
            <p className="mt-3 text-center text-xs text-ink-soft">
              Publishing updates the student Weekly Menu instantly and keeps their ratings linked to dish names.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}