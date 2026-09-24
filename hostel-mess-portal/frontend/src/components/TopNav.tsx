import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TabKey } from '../types';
import Icon from './Icon';
import { Avatar } from './ui';

const NAV_LINKS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'menu', label: 'Menu', icon: 'restaurant_menu' },
  { key: 'feedback', label: 'Feedback', icon: 'rate_review' },
  { key: 'dashboard', label: 'Dashboard', icon: 'monitoring' },
  { key: 'editor', label: 'Editor', icon: 'edit_note' },
];

export default function TopNav() {
  const {
    user,
    isWarden,
    role,
    tab,
    setTab,
    switchRole,
    logout,
    notices,
    openModal,
    theme,
    toggleTheme,
  } = useApp();

  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const unreadCount = notices.filter((n) => n.unread).length;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-outline/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button className="flex items-center gap-2.5" onClick={() => setTab('menu')}>
          <span className="flex h-10 w-10 items-center justify-center rounded-md3 bg-primary text-on-primary shadow-md3">
            <Icon name="ramen_dining" size={24} filled />
          </span>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="font-display text-xl font-bold tracking-tight text-primary">CampusBite</span>
            <span className="-mt-0.5 text-[11px] font-medium text-ink-soft">Hostel Mess Portal</span>
          </span>
        </button>

        {isWarden && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/20 px-2.5 py-1 text-[11px] font-bold text-on-primary-container">
            <Icon name="shield_person" size={14} filled />
            Admin Portal
          </span>
        )}

        {/* Center nav links */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = tab === link.key;
            const locked = link.key === 'editor' && !isWarden;
            return (
              <button
                key={link.key}
                onClick={() => setTab(link.key)}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'text-primary' : 'text-ink-soft hover:bg-surface-default hover:text-ink'
                }`}
              >
                <Icon name={locked ? 'lock' : link.icon} size={17} filled={active} />
                {link.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          {/* Switch role */}
          <button
            onClick={switchRole}
            className="hidden items-center gap-2 rounded-full bg-secondary-container/50 px-4 py-2 text-sm font-bold text-on-secondary-container transition hover:bg-secondary-container sm:inline-flex"
            title="Toggle between Student and Warden view"
          >
            <Icon name="swap_horiz" size={17} weight={700} />
            Switch Role
            <span className="rounded-full bg-on-secondary-container px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary-container">
              {role}
            </span>
          </button>

          {/* System status */}
          <button
            onClick={() => openModal('systemStatus')}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface-default hover:text-ink md:inline-flex"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            System Status
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full p-2.5 text-ink-soft transition hover:bg-surface-default hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full p-2.5 text-ink-soft transition hover:bg-surface-default hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              openModal('notifications');
            }}
            className="relative rounded-full p-2.5 text-ink-soft transition hover:bg-surface-default hover:text-ink"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={21} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-surface-default"
              aria-label="Account menu"
            >
              <Avatar name={user?.name ?? 'Guest'} color={user?.avatarColor} size={36} />
              <Icon name="expand_more" size={18} className="hidden text-ink-soft sm:block" />
            </button>

            {avatarOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 animate-pop-in rounded-md3 bg-surface-lowest p-2 shadow-md3-lg">
                <div className="flex items-center gap-3 border-b border-outline/60 px-3 py-3">
                  <Avatar name={user?.name ?? 'Guest'} color={user?.avatarColor} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-ink">{user?.name}</p>
                    <p className="truncate text-xs text-ink-soft">{user?.block}</p>
                    <p className="text-[11px] font-semibold text-primary">{role === 'warden' ? 'Warden / Admin' : 'Student'}</p>
                  </div>
                </div>
                <div className="py-1.5">
                  {[
                    { label: 'System Status', icon: 'sensors', action: () => openModal('systemStatus') },
                    { label: 'Notifications', icon: 'notifications', action: () => openModal('notifications') },
                    { label: 'Help & Support', icon: 'support_agent', action: () => openModal('support') },
                    { label: 'Privacy Policy', icon: 'policy', action: () => openModal('privacy') },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setAvatarOpen(false);
                        item.action();
                      }}
                      className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-surface-default"
                    >
                      <Icon name={item.icon} size={18} className="text-ink-soft" />
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-outline/60 pt-1.5">
                  <button
                    onClick={() => {
                      setAvatarOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-bold text-error transition hover:bg-error-container/60"
                  >
                    <Icon name="logout" size={18} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-around gap-1 border-t border-outline/60 px-2 py-1 lg:hidden">
        {NAV_LINKS.map((link) => {
          const active = tab === link.key;
          const locked = link.key === 'editor' && !isWarden;
          return (
            <button
              key={link.key}
              onClick={() => setTab(link.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-semibold transition ${
                active ? 'text-primary' : 'text-ink-soft'
              }`}
            >
              <Icon name={locked ? 'lock' : link.icon} size={20} filled={active} />
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}