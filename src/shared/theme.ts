/**
 * Canvas, palette and type for every video. Components take a `Palette` prop
 * instead of importing colours directly, so a channel re-skins the kit by
 * editing one object, not every scene.
 */
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export type Palette = {
  /** Frame background behind everything. */
  bg: string;
  /** Darker layer for scrims and panels. */
  deep: string;
  /** Panel and card surface. */
  surface: string;
  /** The one colour that means "look here": current caption word, key line. */
  accent: string;
  accentSoft: string;
  /** Numbers and warnings. */
  warn: string;
  /** Reserve for the punch. Overuse kills it. */
  bad: string;
  good: string;
  text: string;
  muted: string;
};

export const DEFAULT_PALETTE: Palette = {
  bg: "#0B1016",
  deep: "#121A23",
  surface: "#1B2733",
  accent: "#3FD0FF",
  accentSoft: "#A6E9FF",
  warn: "#FFC83D",
  bad: "#FF4D4D",
  good: "#7BE07B",
  text: "#FFFFFF",
  muted: "#A7B4C2",
};

/**
 * Silicon Matrix Stories (since 2026-11-12): dark blue #0A192F, white #FFFFFF,
 * gold #D4AF37 (§6). Other roles are tints of those three. There is no red:
 * the punch (`bad`) is plain white, so it has to earn attention by size, not colour.
 */
export const CHANNEL_PALETTE: Palette = {
  bg: "#0A192F",
  deep: "#06101F",
  surface: "#12284A",
  accent: "#D4AF37",
  accentSoft: "#E9D48C",
  warn: "#D4AF37",
  bad: "#FFFFFF",
  good: "#D4AF37",
  text: "#FFFFFF",
  muted: "#8FA3C0",
};

export const FONT = {
  sans: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;
