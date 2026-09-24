import type { CSSProperties } from 'react';

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  weight?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({
  name,
  filled = false,
  size = 22,
  weight = 500,
  className = '',
  style,
}: IconProps) {
  const variations: CSSProperties = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
    fontSize: size,
  };
  return (
    <span
      className={`material-symbols-outlined inline-block select-none leading-none ${className}`}
      style={{ ...variations, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}