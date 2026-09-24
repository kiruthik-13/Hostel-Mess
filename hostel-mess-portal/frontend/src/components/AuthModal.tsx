import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS, STUDENT_ACCOUNT, WARDEN_ACCOUNT } from '../data/seed';
import Icon from './Icon';

type Mode = 'login' | 'register';

const BLOCKS = [
  'Block A · North Campus',
  'Block B · South Campus',
  'Block C · South Campus',
  'Block D · West Campus',
];

export default function AuthModal() {
  const { login, showSuccess } = useApp();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [block, setBlock] = useState(BLOCKS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doLogin = (asWarden: boolean, displayName?: string) => {
    const demo = DEMO_USERS.find((u) => u.role === (asWarden ? 'warden' : 'student'))!;
    login(demo);
    showSuccess('Welcome back!', `Signed in as ${displayName ?? demo.name} (${asWarden ? 'Warden / Admin' : 'Student'}).`);
  };

  const handleDemo = (asWarden: boolean) => {
    const mail = asWarden ? WARDEN_ACCOUNT.email : STUDENT_ACCOUNT.email;
    const pass = asWarden ? WARDEN_ACCOUNT.password : STUDENT_ACCOUNT.password;
    setMode('login');
    setEmail(mail);
    setPassword(pass);
    doLogin(asWarden);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (mode === 'register' && !name.trim())) {
      setError('Please fill in all fields to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const asWarden = email.includes('admin') || mode === 'register' && block.includes('South');
      const demo = DEMO_USERS.find((u) => u.role === (asWarden ? 'warden' : 'student'))!;
      setLoading(false);
      login({
        ...demo,
        email,
        name: mode === 'register' ? name.trim() : demo.name,
        block: mode === 'register' ? block : demo.block,
      });
      showSuccess(
        mode === 'login' ? 'Welcome back!' : 'Account created!',
        `You are now signed in as ${mode === 'register' ? name.trim() : demo.name}.`,
      );
    }, 1400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary-container/30 blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up rounded-md3 bg-surface-lowest p-8 shadow-md3-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-md3 bg-primary text-on-primary shadow-md3">
            <Icon name="ramen_dining" size={36} filled />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">CampusBite</h1>
          <p className="mt-1 text-sm text-ink-soft">Weekly Menu & Dining Feedback for hostel life</p>

          <div className="mt-5 flex w-full gap-1 rounded-full bg-surface-default p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`flex-1 rounded-full py-2 text-sm font-bold capitalize transition ${
                  mode === m ? 'bg-primary text-on-primary shadow-md3' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick demo access */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDemo(false)}
            className="group rounded-md3 border border-outline-strong/40 bg-surface-lowest p-4 text-left transition hover:border-primary hover:shadow-md3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/20 text-on-primary-container">
              <Icon name="school" size={18} />
            </span>
            <p className="mt-2 font-display text-sm font-bold text-ink">Student</p>
            <p className="mt-0.5 text-[11px] text-ink-soft">Block A · North Campus</p>
            <p className="mt-1 text-[11px] font-semibold text-primary group-hover:underline">One-tap demo →</p>
          </button>
          <button
            onClick={() => handleDemo(true)}
            className="group rounded-md3 border border-outline-strong/40 bg-surface-lowest p-4 text-left transition hover:border-secondary hover:shadow-md3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container/40 text-on-secondary-container">
              <Icon name="shield_person" size={18} />
            </span>
            <p className="mt-2 font-display text-sm font-bold text-ink">Warden / Admin</p>
            <p className="mt-0.5 text-[11px] text-ink-soft">Block B · South Campus</p>
            <p className="mt-1 text-[11px] font-semibold text-secondary group-hover:underline">One-tap demo →</p>
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-outline/70" />
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">or continue manually</span>
          <span className="h-px flex-1 bg-outline/70" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="md-label" htmlFor="auth-name">Full name</label>
              <input id="auth-name" className="md-input" placeholder="e.g. Ananya Rao" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div>
            <label className="md-label" htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" className="md-input" placeholder="you@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label className="md-label" htmlFor="auth-pass">Password</label>
            <input id="auth-pass" type="password" className="md-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>
          {mode === 'register' && (
            <div>
              <label className="md-label" htmlFor="auth-block">Hostel block</label>
              <select id="auth-block" className="md-input" value={block} onChange={(e) => setBlock(e.target.value)}>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-full bg-error-container px-4 py-2 text-sm font-semibold text-on-error-container">{error}</p>
          )}

          <button type="submit" disabled={loading} className="md-btn-primary w-full py-3">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                Signing in…
              </>
            ) : (
              <>
                <Icon name="login" size={18} filled />
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-soft">
          Demo access fills <span className="font-semibold text-ink">student1@mess.com</span> / <span className="font-semibold text-ink">student123</span> or{' '}
          <span className="font-semibold text-ink">admin@mess.com</span> / <span className="font-semibold text-ink">admin123</span>.
        </p>
      </div>
    </div>
  );
}