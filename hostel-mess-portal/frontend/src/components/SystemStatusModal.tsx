import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';
import { Modal, ProgressBar } from './ui';

interface Telemetry {
  key: string;
  label: string;
  value: string;
  unit: string;
  icon: string;
  status: 'good' | 'warn' | 'bad';
  pct: number;
}

function TelemetryCard({ item }: { item: Telemetry }) {
  const tone = {
    good: { text: 'text-secondary', dot: 'bg-secondary', bar: '#006c4a' },
    warn: { text: 'text-primary', dot: 'bg-primary', bar: '#f97316' },
    bad: { text: 'text-error', dot: 'bg-error', bar: '#ba1a1a' },
  }[item.status];

  return (
    <div className="rounded-md3 border border-outline/60 bg-surface-lowest p-4">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-default text-primary">
          <Icon name={item.icon} size={20} />
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-ink-soft">
          <span className={`h-2 w-2 rounded-full ${tone.dot} animate-pulse-dot`} />
          {item.pct}%
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink">
        {item.value}
        <span className="ml-1 text-sm font-semibold text-ink-soft">{item.unit}</span>
      </p>
      <p className="text-sm font-medium text-ink-soft">{item.label}</p>
      <div className="mt-2.5">
        <ProgressBar value={item.pct} max={100} color={tone.bar} />
      </div>
    </div>
  );
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function SystemStatusModal() {
  const { closeModal, openModal } = useApp();
  const [walkIn, setWalkIn] = useState(3.2);
  const [freezer, setFreezer] = useState(-18.4);
  const [tds, setTds] = useState(42);
  const [capacity, setCapacity] = useState(64);
  const [hygiene, setHygiene] = useState(99);

  useEffect(() => {
    const id = setInterval(() => {
      setWalkIn((v) => clamp(+(v + (Math.random() - 0.5) * 0.2).toFixed(1), 2.5, 4.2));
      setFreezer((v) => clamp(+(v + (Math.random() - 0.5) * 0.2).toFixed(1), -19.5, -17.5));
      setTds((v) => clamp(v + Math.round((Math.random() - 0.5) * 2), 25, 80));
      setCapacity((v) => clamp(v + Math.round((Math.random() - 0.5) * 4), 10, 96));
      setHygiene((v) => clamp(v + Math.round((Math.random() - 0.5)), 96, 100));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const items: Telemetry[] = [
    { key: 'walkin', label: 'Cold Storage · Walk-in', value: walkIn.toFixed(1), unit: '°C', icon: 'ac_unit', status: 'good', pct: 94 },
    { key: 'freezer', label: 'Deep Freezer', value: freezer.toFixed(1), unit: '°C', icon: 'severe_cold', status: 'good', pct: 97 },
    { key: 'tds', label: 'Water RO · TDS Level', value: String(tds), unit: 'PPM', icon: 'water_drop', status: 'good', pct: 86 },
    { key: 'hygiene', label: 'Kitchen Hygiene Grade', value: `A+ · ${hygiene}`, unit: '%', icon: 'cleaning_services', status: 'good', pct: hygiene },
    { key: 'capacity', label: 'Dining Hall Capacity (live)', value: `${capacity}`, unit: '/ 96 seated', icon: 'groups', status: capacity > 85 ? 'warn' : 'good', pct: capacity },
  ];

  return (
    <Modal title="System Status" subtitle="Live kitchen & dining hall telemetry" onClose={closeModal} icon="sensors" wide>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <TelemetryCard key={item.key} item={item} />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-md3 bg-surface-low px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <Icon name="sensors" size={17} className="text-secondary" />
          All systems operational
        </p>
        <button onClick={() => openModal('notifications')} className="md-btn-secondary px-4 py-2 text-xs">
          View outage notices
        </button>
      </div>
    </Modal>
  );
}