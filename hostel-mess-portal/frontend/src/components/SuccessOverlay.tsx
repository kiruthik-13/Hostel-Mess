import { useApp } from '../context/AppContext';

export default function SuccessOverlay() {
  const { success } = useApp();
  if (!success) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-6 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center rounded-md3 bg-surface-lowest px-10 py-8 text-center shadow-md3-lg animate-pop-in">
        <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
          <circle
            cx="46"
            cy="46"
            r="40"
            stroke="#82f5c1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset="251"
          >
            <animate attributeName="stroke-dashoffset" from="251" to="0" dur="0.5s" fill="freeze" />
          </circle>
          <circle
            cx="46"
            cy="46"
            r="40"
            stroke="#82f5c1"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M30 47 L42 59 L64 34"
            stroke="#006c4a"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            strokeDashoffset="48"
          >
            <animate attributeName="stroke-dashoffset" from="48" to="0" dur="0.35s" begin="0.35s" fill="freeze" />
          </path>
        </svg>
        <p className="mt-4 font-display text-lg font-bold text-ink">{success.title}</p>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">{success.message}</p>
      </div>
    </div>
  );
}