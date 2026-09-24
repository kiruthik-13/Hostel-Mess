import { useApp } from '../context/AppContext';
import Icon from './Icon';
import { Modal } from './ui';

export function SupportModal() {
  const { closeModal, openModal } = useApp();
  return (
    <Modal title="Help & Support" subtitle="We reply to every ticket within a day" onClose={closeModal} icon="support_agent">
      <div className="space-y-4 text-sm leading-relaxed text-ink-soft">
        <p>
          Facing a mess issue — cold food, long queues, or allergy questions? Let the mess team know through a feedback
          ticket or reach the wardens directly.
        </p>
        <ul className="space-y-2">
          {[
            { icon: 'call', text: 'Mess Office · 040-2314-5500 (08:00 – 21:00)' },
            { icon: 'mail', text: 'support@campusbite.edu' },
            { icon: 'location_on', text: 'Main Dining Hall, Ground Floor, North Block' },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-3 rounded-full bg-surface-low px-4 py-2.5 font-semibold text-ink">
              <Icon name={item.icon} size={17} className="text-primary" />
              {item.text}
            </li>
          ))}
        </ul>
        <p>
          Meal timings and menu disputes are resolved by the Duty Warden within 24 hours. Ratings above remain anonymous
          to the kitchen staff.
        </p>
        <button onClick={() => openModal('privacy')} className="text-sm font-bold text-primary hover:underline">
          Read our privacy policy →
        </button>
      </div>
    </Modal>
  );
}

export function PrivacyModal() {
  const { closeModal } = useApp();
  return (
    <Modal title="Privacy Policy" subtitle="Your dining data, handled with care" onClose={closeModal} icon="policy">
      <div className="prose-sm space-y-3 text-sm leading-relaxed text-ink-soft">
        <p>
          CampusBite stores your name, hostel block and feedback submissions to help the mess administration improve
          meals and service quality.
        </p>
        <p>
          <span className="font-bold text-ink">Anonymity.</span> Kitchen staff see neither your name nor block — only
          aggregated, anonymized ratings. Identifiable details are shared exclusively with wardens for resolution.
        </p>
        <p>
          <span className="font-bold text-ink">Retention.</span> Feedback is retained for one academic year for audit
          and food-safety reporting, then deleted automatically.
        </p>
        <p>
          <span className="font-bold text-ink">Your choices.</span> You may request export or deletion of your data at
          any time via support@campusbite.edu. We never sell or share your personal data with third parties.
        </p>
        <p className="rounded-md3 bg-surface-low px-4 py-3 text-xs font-semibold text-ink-soft">
          By using CampusBite you agree to this policy. Updated Sep 2026.
        </p>
      </div>
    </Modal>
  );
}