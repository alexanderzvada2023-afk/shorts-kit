import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Bit} from "../../shared/figures/Bit";
import {PANEL_LEFT, PANEL_MAX_W, STAGE_TOP} from "../../shared/frame/SafeZones";
import type {SceneComponent, SceneProps} from "../../shared/frame/ShortsTemplate";
import {clamp, fade, glide, ramp} from "../../shared/motion/anim";
import {FONT, type Palette, W} from "../../shared/theme";
import {wordFrame, type SceneWord} from "../../shared/timings";
import storyboard from "./storyboard.json";

/**
 * NVIDIA ohne Huang (flow R). Storyboard: storyboard.json (s01–s11).
 * One clean 2D world in the channel palette (dark blue, white, gold); Bit narrates
 * from the lower left. Shots start on their line's anchor word (`wordFrame`).
 * On-frame text (§7c): hook (date, −11 %), moment (years), payoff (since 1993),
 * share (17.11.).
 */

const CX = W / 2;
const RIGHT = PANEL_LEFT + PANEL_MAX_W; // 927: never past the button column

/** Bit's mouth follows the voice: open while a word is spoken. */
const talkAt = (frame: number, words: SceneWord[]) => {
  const w = words.find((x) => frame >= x.from && frame < x.to);
  return w ? 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.9)) : 0;
};

const Narrator: React.FC<{words: SceneWord[]; palette: Palette; look?: number}> = ({words, palette, look = 0.6}) => {
  const frame = useCurrentFrame();
  const blink = frame % 96 < 4 ? 1 : 0;
  const bob = Math.sin(frame / 14) * 6;
  return (
    <Bit
      palette={palette}
      size={230}
      talk={talkAt(frame, words)}
      blink={blink}
      look={look}
      style={{position: "absolute", left: PANEL_LEFT - 20, top: 1000 + bob, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))"}}
    />
  );
};

const Kicker: React.FC<{text: string; palette: Palette; opacity?: number; top?: number}> = ({text, palette, opacity = 1, top = STAGE_TOP}) => (
  <div
    style={{
      position: "absolute",
      left: PANEL_LEFT,
      width: PANEL_MAX_W,
      top,
      textAlign: "center",
      fontFamily: FONT.sans,
      fontWeight: 800,
      fontSize: 46,
      letterSpacing: 6,
      color: palette.accent,
      opacity,
    }}
  >
    {text}
  </div>
);

const Big: React.FC<{text: string; palette: Palette; top: number; size?: number; color?: string; opacity?: number; scale?: number}> = ({
  text,
  palette,
  top,
  size = 150,
  color,
  opacity = 1,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: PANEL_LEFT,
      width: PANEL_MAX_W,
      top,
      textAlign: "center",
      fontFamily: FONT.sans,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      color: color ?? palette.text,
      opacity,
      transform: `scale(${scale})`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** The board table seen from its end; `head` is the empty chair, `chair` the new gold chair at the far end. */
const BoardTable: React.FC<{palette: Palette; zoom: number; interim?: number; chair?: number}> = ({palette: p, zoom, interim = 0, chair = 0}) => {
  const seats = [0, 1, 2, 3];
  return (
    <svg width={W} height={1920} style={{position: "absolute", transform: `scale(${zoom})`, transformOrigin: "50% 45%"}}>
      {/* far-end chair of the board (rises in) */}
      <g opacity={chair} transform={`translate(0 ${(1 - chair) * 40})`}>
        <rect x={CX - 70} y={360} width={140} height={150} rx={22} fill={p.accent} />
        <rect x={CX - 90} y={500} width={180} height={34} rx={10} fill={p.accent} />
      </g>
      {/* table */}
      <polygon points={`${CX - 120},540 ${CX + 120},540 ${CX + 300},1000 ${CX - 300},1000`} fill={p.surface} stroke={p.accentSoft} strokeOpacity={0.35} strokeWidth={3} />
      {/* side chairs */}
      {seats.map((i) => {
        const t = (i + 0.5) / seats.length;
        const y = 560 + t * 420;
        const half = 120 + t * 180;
        const s = 0.6 + t * 0.5;
        return (
          <g key={i} fill={p.muted} opacity={0.55}>
            <rect x={CX - half - 70 * s} y={y - 30 * s} width={56 * s} height={70 * s} rx={10} />
            <rect x={CX + half + 14 * s} y={y - 30 * s} width={56 * s} height={70 * s} rx={10} />
          </g>
        );
      })}
      {/* head chair, near end: empty, gold rim */}
      <rect x={CX - 110} y={1010} width={220} height={60} rx={14} fill={p.deep} stroke={p.accent} strokeWidth={6} />
      <rect x={CX - 95} y={1060} width={190} height={170} rx={26} fill="none" stroke={p.accent} strokeWidth={6} />
      {/* interim: a dashed outline sits in the head chair */}
      <g opacity={interim} fill="none" stroke={p.text} strokeWidth={5} strokeDasharray="14 10">
        <circle cx={CX} cy={930} r={52} />
        <path d={`M ${CX - 90} 1070 Q ${CX} 960 ${CX + 90} 1070`} />
      </g>
    </svg>
  );
};

/** hook: the empty chair under "33 JAHRE" (s01), then the drop (s02). No drawn price curve: it would invent data (§5). */
const Hook: SceneComponent = ({words, palette: p}) => {
  const frame = useCurrentFrame();
  const fall = wordFrame(words, "Vorbörslich");
  const tableK = 1 - ramp(frame, fall - 6, 12);
  const dropK = ramp(frame, fall - 6, 12);
  const arrow = ramp(frame, fall, 24);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: tableK}}>
        <BoardTable palette={p} zoom={glide(frame, [0, fall + 10], [1, 1.06])} />
        <Big text="33 JAHRE" palette={p} top={390} size={124} />
      </AbsoluteFill>
      <Kicker text="12.11.2026" palette={p} />
      <AbsoluteFill style={{opacity: dropK}}>
        <svg width={W} height={1920} style={{position: "absolute"}}>
          <g transform={`translate(${CX} ${700 + arrow * 80})`} opacity={arrow}>
            <rect x={-30} y={0} width={60} height={200} rx={12} fill={p.text} />
            <polygon points="-100,190 100,190 0,330" fill={p.text} />
          </g>
        </svg>
        <Big text="−11 %" palette={p} top={420} size={170} color={p.accent} opacity={ramp(frame, fall + 20, 10)} scale={0.9 + 0.1 * ramp(frame, fall + 20, 10)} />
        <Kicker text="VORBÖRSLICH" palette={p} top={600} opacity={ramp(frame, fall + 24, 10)} />
      </AbsoluteFill>
      <Narrator words={words} palette={p} />
    </AbsoluteFill>
  );
};

/** A simple founder figure: head and shoulders, flat. */
const Founder: React.FC<{x: number; y: number; palette: Palette; k: number}> = ({x, y, palette: p, k}) => (
  <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 30})`}>
    <circle cx={0} cy={-70} r={38} fill={p.text} />
    <path d="M -64 20 Q -64 -26 0 -26 Q 64 -26 64 20 Z" fill={p.text} />
  </g>
);

/** moment: the diner, Huang and two co-founders appear on their words (s03), the napkin becomes the company (s04). */
const Moment: SceneComponent = ({words, palette: p}) => {
  const frame = useCurrentFrame();
  const fDort = wordFrame(words, "Huang");
  const fApril = wordFrame(words, "April");
  const push = glide(frame, [fDort - 10, fDort + 30], [1, 1.12]);
  const drift = glide(frame, [0, fDort], [-30, -10]);
  const fTwo = wordFrame(words, "zwei");
  const founders = [
    {name: "huang", x: CX - 170, at: fDort},
    {name: "two-a", x: CX, at: fTwo},
    {name: "two-b", x: CX + 170, at: fTwo + 6},
  ].map((f) => ({...f, k: ramp(frame, f.at - 3, 10)}));
  const card = ramp(frame, fApril - 4, 16);
  const count = Math.round(interpolate(frame, [fApril + 30, fApril + 70], [0, 40000], clamp));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${drift}px) scale(${push})`, transformOrigin: "48% 60%", opacity: 1 - card * 0.85}}>
        <svg width={W} height={1920} style={{position: "absolute"}}>
          {/* night street + diner */}
          <rect x={0} y={1100} width={W} height={200} fill={p.deep} />
          <rect x={190} y={530} width={700} height={590} rx={16} fill={p.surface} />
          <rect x={225} y={600} width={630} height={430} rx={10} fill={p.accentSoft} opacity={0.18} />
          <rect x={225} y={600} width={630} height={430} rx={10} fill="none" stroke={p.accent} strokeWidth={6} />
          {/* booth + table */}
          <rect x={300} y={880} width={480} height={30} rx={8} fill={p.accent} opacity={0.9} />
          <rect x={260} y={780} width={40} height={230} rx={10} fill={p.deep} />
          <rect x={780} y={780} width={40} height={230} rx={10} fill={p.deep} />
          {founders.map((f) => (
            <Founder key={f.name} x={f.x} y={870} palette={p} k={f.k} />
          ))}
          {/* napkin with a chip sketch */}
          <g opacity={ramp(frame, fDort + 20, 12)}>
            <rect x={CX - 46} y={884} width={92} height={22} rx={4} fill={p.text} />
            <rect x={CX - 12} y={888} width={24} height={14} fill="none" stroke={p.bg} strokeWidth={3} />
          </g>
        </svg>
        <div style={{position: "absolute", left: 0, width: W, top: 548, textAlign: "center", fontFamily: FONT.sans, fontWeight: 800, fontSize: 36, letterSpacing: 4, color: p.text}}>
          DINER · SAN JOSÉ
        </div>
      </AbsoluteFill>
      <Kicker text={frame < fApril ? "ENDE 1992" : "APRIL 1993"} palette={p} opacity={fade(frame, 4, 12)} />
      {/* the napkin becomes a gold chip card */}
      <AbsoluteFill style={{opacity: card}}>
        <div
          style={{
            position: "absolute",
            left: CX - 230,
            top: 520,
            width: 460,
            height: 300,
            borderRadius: 30,
            border: `8px solid ${p.accent}`,
            background: p.surface,
            transform: `scale(${0.8 + 0.2 * card})`,
          }}
        />
        <Big text="NVIDIA" palette={p} top={620} size={110} />
        <Big text={`${count.toLocaleString("de-DE")} $`} palette={p} top={880} size={130} color={p.accent} opacity={ramp(frame, fApril + 26, 8)} />
      </AbsoluteFill>
      <Narrator words={words} palette={p} />
    </AbsoluteFill>
  );
};

/** turn: the release names no reason (s06). */
const Turn: SceneComponent = ({words, palette: p, duration}) => {
  const frame = useCurrentFrame();
  const zoom = glide(frame, [0, duration], [1, 1.04]);
  const cursor = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;
  const lines = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 230, top: 380, width: 620, height: 600, borderRadius: 18, background: p.text, transform: `scale(${zoom}) rotate(-2deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)"}}>
        <div style={{position: "absolute", left: 50, top: 46, width: 300, height: 26, borderRadius: 6, background: p.bg}} />
        {lines.map((i) => (
          <div key={i} style={{position: "absolute", left: 50, top: 120 + i * 50, width: 520 - (i % 2) * 90, height: 16, borderRadius: 6, background: p.muted, opacity: 0.6}} />
        ))}
        <div style={{position: "absolute", left: 50, top: 420, fontFamily: FONT.sans, fontWeight: 900, fontSize: 64, color: p.bg}}>
          Grund:
          <span style={{display: "inline-block", width: 8, height: 60, marginLeft: 20, verticalAlign: "-8px", background: p.accent, opacity: cursor}} />
        </div>
      </div>
      <Narrator words={words} palette={p} look={1} />
    </AbsoluteFill>
  );
};

/** consequence: interim CEO in the empty chair (s07), the first chair of the board rises (s08). */
const Consequence: SceneComponent = ({words, palette: p, duration}) => {
  const frame = useCurrentFrame();
  const fHarvey = wordFrame(words, "Harvey");
  return (
    <AbsoluteFill>
      <BoardTable palette={p} zoom={glide(frame, [0, duration], [1.02, 1.1])} interim={ramp(frame, wordFrame(words, "Colette"), 14)} chair={ramp(frame, fHarvey, 20)} />
      <Narrator words={words} palette={p} />
    </AbsoluteFill>
  );
};

/** payoff: a true-scale timeline 1993 → 2026 (s09); the founder line ends, the gold line runs on (s10). */
const Y0 = 1993;
const Y1 = 2026.87; // 12.11.2026
const X0 = PANEL_LEFT + 30;
const X1 = RIGHT - 30;
const xOf = (y: number) => X0 + ((y - Y0) / (Y1 - Y0 + 1.2)) * (X1 - X0);
const Payoff: SceneComponent = ({words, palette: p}) => {
  const frame = useCurrentFrame();
  const fGr = wordFrame(words, "Gründer");
  const grow = ramp(frame, 4, 40);
  const end = xOf(Y0 + (Y1 - Y0) * grow);
  const goldRun = xOf(Y1) + ramp(frame, fGr + 20, 30) * (X1 - xOf(Y1) + 10);
  const cut = ramp(frame, fGr, 12);
  return (
    <AbsoluteFill>
      <Kicker text="SEIT 1993" palette={p} opacity={fade(frame, 10, 12)} />
      <svg width={W} height={1920} style={{position: "absolute"}}>
        {/* axis, true scale */}
        <line x1={X0} x2={X1} y1={900} y2={900} stroke={p.muted} strokeWidth={3} />
        {[1993, 2000, 2010, 2020, 2026].map((y) => (
          <g key={y}>
            <line x1={xOf(y)} x2={xOf(y)} y1={890} y2={910} stroke={p.muted} strokeWidth={3} />
            <text x={xOf(y)} y={950} fill={p.muted} fontSize={30} fontFamily={FONT.sans} fontWeight={700} textAnchor="middle">
              {y}
            </text>
          </g>
        ))}
        {/* founder line (white), ends 12.11.2026 */}
        <line x1={X0} x2={end} y1={700} y2={700} stroke={p.text} strokeWidth={12} strokeLinecap="round" />
        <g opacity={cut}>
          <line x1={xOf(Y1)} x2={xOf(Y1)} y1={660} y2={740} stroke={p.text} strokeWidth={8} />
        </g>
        <text x={X0} y={665} fill={p.text} fontSize={36} fontFamily={FONT.sans} fontWeight={800}>
          Huang
        </text>
        {/* board line (gold), runs on */}
        <line x1={X0} x2={grow < 1 ? end : goldRun} y1={800} y2={800} stroke={p.accent} strokeWidth={12} strokeLinecap="round" />
        <text x={X0} y={775} fill={p.accent} fontSize={36} fontFamily={FONT.sans} fontWeight={800}>
          Jones
        </text>
      </svg>
      <Narrator words={words} palette={p} look={0.8} />
    </AbsoluteFill>
  );
};

/** share: the calendar flips to the 17th (s11). */
const Share: SceneComponent = ({words, palette: p, duration}) => {
  const frame = useCurrentFrame();
  const flip = ramp(frame, 6, 16);
  const zoom = glide(frame, [0, duration], [1, 1.05]);
  const day = flip < 0.5 ? "12" : "17";
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: CX - 220, top: 400, width: 440, height: 480, transform: `scale(${zoom})`}}>
        <div style={{position: "absolute", inset: 0, borderRadius: 30, background: p.text, boxShadow: "0 30px 60px rgba(0,0,0,0.5)"}} />
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 120, borderRadius: "30px 30px 0 0", background: p.accent, fontFamily: FONT.sans, fontWeight: 900, fontSize: 56, color: p.bg, textAlign: "center", lineHeight: "120px", letterSpacing: 4}}>
          NOVEMBER
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 150,
            textAlign: "center",
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 260,
            lineHeight: 1,
            color: day === "17" ? p.accent : p.bg,
            transform: `scaleY(${Math.abs(1 - 2 * flip) * 0.9 + 0.1})`,
          }}
        >
          {day}
        </div>
      </div>
      <Narrator words={words} palette={p} look={1} />
    </AbsoluteFill>
  );
};

const byId: Record<string, SceneComponent> = {hook: Hook, moment: Moment, turn: Turn, consequence: Consequence, payoff: Payoff, share: Share};
export const scenes: Record<string, SceneComponent> = byId;
export type {SceneProps};
/** Shot list this file implements (kept imported so the build fails if the storyboard is removed). */
export const SHOTS = storyboard.shots.length;
