import { useApp } from '../context/AppContext';
import Icon from './Icon';

const KIND_STYLE: Record<string, { icon: string; cls: string }> = {
  notice: { icon: 'campaign', cls: 'bg-primary-container/20 text-on-primary-container' },
  'chef-special': { icon: 'chef_hat', cls: 'bg-secondary-container/40 text-on-secondary-container' },
  alert: { icon: 'warning', cls: 'bg-error-container text-on-error-container' },
};

export default function NotificationsDrawer() {
  const { notices, closeModal, markAllNoticesRead, openModal } = useApp();

  const unread = notices.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-lowest shadow-md3-lg animate-slide-up">
        <div className="flex items-center justify-between border-b border-outline/60 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Notifications</h2>
            <p className="text-xs text-ink-soft">
              {unread > 0 ? `${unread} unread update${unread > 1 ? 's' : ''}` : 'You’re all caught up'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={markAllNoticesRead} className="md-btn-ghost px-3 py-1.5 text-xs" disabled={unread === 0}>
              Mark all read
            </button>
            <button onClick={closeModal} className="rounded-full p-2 text-ink-soft transition hover:bg-surface-high" aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {notices.map((n) => {
            const style = KIND_STYLE[n.kind];
            return (
              <div key={n.id} className={`relative rounded-md3 border p-4 transition ${n.unread ? 'border-primary/40 bg-surface-low' : 'border-outline/60 bg-surface-lowest'}`}>
                {n.unread && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-primary" />}
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${style.cls}`}>
                  <Icon name={style.icon} size={18} />
                </span>
                <p className="mt-2 text-sm font-bold text-ink">{n.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{n.body}</p>
                <p className="mt-2 text-[11px] font-semibold text-ink-soft/70">{n.time}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-outline/60 px-5 py-3 text-center">
          <button onClick={() => { closeModal(); openModal('systemStatus'); }} className="text-xs font-bold text-primary hover:underline">
            Check kitchen system telemetry →
          </button>
        </div>
      </aside>
    </div>
  );
}