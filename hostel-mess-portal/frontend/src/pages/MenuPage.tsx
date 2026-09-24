import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Meal } from '../types';
import { DINING_LOCATIONS, MEAL_SLOT_META, WEEK_LABEL } from '../data/seed';
import Icon from '../components/Icon';
import { Badge, Chip } from '../components/ui';

/* ------------------------------------------------------------------ */
/* Meal card                                                           */
/* ------------------------------------------------------------------ */

function MealCard({ meal, dayId }: { meal: Meal; dayId: string }) {
  const { openFeedbackModal } = useApp();

  const slotMeta = MEAL_SLOT_META[meal.slot];
  const accent = slotMeta.color;

  return (
    <article className="md-card flex flex-col p-5 transition hover:shadow-md3-lg hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        <span
          className="md-tag"
          style={{ backgroundColor: `${accent}1f`, color: '#582200' }}
        >
          {meal.tag}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-ink-soft">
          <Icon name="schedule" size={14} />
          {meal.schedule}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <h3 className="heading text-xl">{meal.title}</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
          <Icon name="location_on" size={13} />
          {meal.location.split(' ')[0]}
        </span>
      </div>

      <ul className="mt-4 flex-1 space-y-3">
        {meal.dishes.map((dish) => (
          <li key={dish.id} className="flex gap-3">
            <span className="mt-1.5 h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-ink">{dish.name}</p>
                <span className="ml-auto shrink-0 rounded-full bg-primary-container/15 px-2 py-0.5 text-[11px] font-bold text-on-primary-container">
                  {dish.calories} kcal
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{dish.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-outline/60 pt-4">
        <Badge color={meal.dietary.toLowerCase().includes('vegan') ? 'secondary' : 'primary'}>
          <Icon name="eco" size={13} filled={meal.dietary.toLowerCase().includes('vegan')} />
          {meal.dietary}
        </Badge>
        <button
          onClick={() => openFeedbackModal({ dayId, meal })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary transition hover:bg-primary/90"
        >
          <Icon name="star" size={15} filled />
          Rate this Meal
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Menu page                                                           */
/* ------------------------------------------------------------------ */

export default function MenuPage() {
  const { menu } = useApp();
  const [activeDayId, setActiveDayId] = useState(() => menu.find((d) => d.isToday)?.id ?? menu[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<string | null>(null);

  const activeDay = menu.find((d) => d.id === activeDayId) ?? menu[0];

  const filteredMeals = useMemo(() => {
    if (!activeDay) return [];
    const q = search.trim().toLowerCase();
    return activeDay.meals.filter((meal) => {
      const inLocation = !location || meal.location === location;
      if (!inLocation) return false;
      if (!q) return true;
      return meal.dishes.some(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    });
  }, [activeDay, search, location]);

  const locationCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of menu) {
      for (const m of d.meals) map.set(m.location, (map.get(m.location) ?? 0) + 1);
    }
    return map;
  }, [menu]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading text-3xl">Weekly Student Menu</h1>
          <p className="mt-1 text-ink-soft">
            See what’s cooking this week, then rate the meals you’ve tried.
          </p>
        </div>
        <Badge color="primary">
          <Icon name="calendar_month" size={14} filled={false} />
          {WEEK_LABEL}
        </Badge>
      </div>

      {/* Day strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {menu.map((day) => {
          const active = day.id === activeDay?.id;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`group flex shrink-0 flex-col items-center rounded-md3 border px-5 py-3 transition ${
                active
                  ? 'border-primary bg-primary text-on-primary shadow-md3'
                  : 'border-outline/60 bg-surface-lowest text-ink hover:border-primary/50'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wide ${active ? 'text-on-primary/80' : 'text-ink-soft'}`}>
                {day.weekday}
              </span>
              <span className="font-display text-lg font-bold">{day.monthDay}</span>
              <span className={`text-[11px] font-semibold ${active ? 'text-on-primary/80' : 'text-ink-soft'}`}>
                {day.month}
              </span>
              {day.isToday && (
                <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-on-primary text-primary' : 'bg-primary-container/20 text-on-primary-container'}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search + location filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
            <Icon name="search" size={19} />
          </span>
          <input
            className="md-input pl-11"
            placeholder="Search dishes, ingredients or prep notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search the menu"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {DINING_LOCATIONS.map((loc) => (
            <Chip
              key={loc}
              label={`${loc} · ${locationCounts.get(loc) ?? 0}`}
              icon="location_on"
              active={location === loc}
              onClick={() => setLocation(location === loc ? null : loc)}
            />
          ))}
        </div>
      </div>

      {/* Meal grid */}
      {filteredMeals.length === 0 ? (
        <div className="flex flex-col items-center rounded-md3 border border-dashed border-outline-strong/40 bg-surface-low/60 px-6 py-14 text-center">
          <Icon name="search_off" size={40} className="text-outline-strong" />
          <p className="mt-3 font-display font-bold text-ink">No dishes match your search</p>
          <p className="mt-1 text-sm text-ink-soft">Try a different keyword or clear the location filter.</p>
          <button className="md-btn-secondary mt-4" onClick={() => { setSearch(''); setLocation(null); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.slot} meal={meal} dayId={activeDay.id} />
          ))}
        </div>
      )}
    </div>
  );
}