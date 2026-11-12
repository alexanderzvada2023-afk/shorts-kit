import React from "react";
import type {Palette} from "../theme";

/**
 * Bit, the narrator of Silicon Matrix Stories (§1, §6): a chip with pixel eyes.
 * Drawn once here, never per video. Pure SVG, so it scales to any size and a
 * still of it doubles as the channel's PNG asset.
 *
 * - `talk` 0..1 opens the mouth (drive it from the voice's word timings);
 * - `blink` 0..1 closes the eyes;
 * - `look` -1..1 shifts the pupils left/right.
 */
export const Bit: React.FC<{
  palette: Palette;
  size?: number;
  talk?: number;
  blink?: number;
  look?: number;
  style?: React.CSSProperties;
}> = ({palette: p, size = 320, talk = 0, blink = 0, look = 0, style}) => {
  const pins = [70, 100, 130];
  const eyeH = 26 * (1 - Math.min(1, Math.max(0, blink))) + 3;
  const dx = Math.max(-1, Math.min(1, look)) * 6;
  const mouthH = 4 + 18 * Math.min(1, Math.max(0, talk));
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      {/* pins */}
      {pins.map((x) => (
        <g key={x} fill={p.accent}>
          <rect x={x - 6} y={14} width={12} height={22} rx={3} />
          <rect x={x - 6} y={164} width={12} height={22} rx={3} />
          <rect x={14} y={x - 6} width={22} height={12} rx={3} />
          <rect x={164} y={x - 6} width={22} height={12} rx={3} />
        </g>
      ))}
      {/* body */}
      <rect x={34} y={34} width={132} height={132} rx={22} fill={p.surface} stroke={p.accent} strokeWidth={6} />
      {/* screen */}
      <rect x={52} y={56} width={96} height={80} rx={12} fill={p.bg} />
      {/* pixel eyes */}
      <rect x={70 + dx} y={82 + (26 - eyeH) / 2} width={18} height={eyeH} fill={p.text} />
      <rect x={112 + dx} y={82 + (26 - eyeH) / 2} width={18} height={eyeH} fill={p.text} />
      {/* mouth */}
      <rect x={88} y={118 - mouthH / 2} width={24} height={mouthH} rx={2} fill={p.accent} />
      {/* corner mark: pin 1 of the chip */}
      <circle cx={52} cy={152} r={5} fill={p.accent} />
    </svg>
  );
};
