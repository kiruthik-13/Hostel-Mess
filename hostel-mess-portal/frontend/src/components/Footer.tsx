import { useApp } from '../context/AppContext';
import Icon from './Icon';

export default function Footer() {
  const { openModal, isWarden } = useApp();
  return (
    <footer className="mt-12 border-t border-outline/60 bg-surface-lowest">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md3 bg-primary text-on-primary">
            <Icon name="ramen_dining" size={20} filled />
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold text-ink">CampusBite</p>
            <p className="text-xs text-ink-soft">Making hostel dining better, one review at a time.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
          <button onClick={() => openModal('support')} className="rounded-full px-3 py-1.5 font-semibold text-ink-soft transition hover:bg-surface-default hover:text-ink">
            Support
          </button>
          <button onClick={() => openModal('privacy')} className="rounded-full px-3 py-1.5 font-semibold text-ink-soft transition hover:bg-surface-default hover:text-ink">
            Privacy
          </button>
          <button onClick={() => openModal('systemStatus')} className="rounded-full px-3 py-1.5 font-semibold text-ink-soft transition hover:bg-surface-default hover:text-ink">
            System Status
          </button>
        </div>
        <p className="text-xs text-ink-soft">
          © 2026 CampusBite · {isWarden ? 'Warden Console' : 'Student Portal'}
        </p>
      </div>
    </footer>
  );
}