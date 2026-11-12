import React from "react";
import {AbsoluteFill} from "remotion";
import {Bit} from "../../shared/figures/Bit";
import {Backdrop} from "../../shared/frame/Backdrop";
import {COVER_BAND, PANEL_LEFT, PANEL_MAX_W} from "../../shared/frame/SafeZones";
import {SafeCheck} from "../../shared/frame/SafeCheck";
import {CHANNEL_PALETTE, FONT} from "../../shared/theme";

/**
 * Cover (§10): one number (33), about three words, no spoiler. "GRUND: ?" opens
 * the gap the video keeps honest: the release names no reason (f-0006).
 * Everything sits inside COVER_BAND (the 1:1.29 grid crop).
 */
const p = CHANNEL_PALETTE;

export const Cover: React.FC<{safe: boolean}> = ({safe}) => (
  <SafeCheck safe={safe} cover>
    <AbsoluteFill>
      <Backdrop palette={p} />
      <div style={{position: "absolute", left: PANEL_LEFT, width: PANEL_MAX_W, top: COVER_BAND.top + 120, textAlign: "center", fontFamily: FONT.sans, color: p.text}}>
        <div style={{fontSize: 64, fontWeight: 900, letterSpacing: 6, color: p.accent}}>NVIDIA-CHEF</div>
        <div style={{fontSize: 440, fontWeight: 900, lineHeight: 0.95, letterSpacing: -10, marginTop: 10}}>33</div>
        <div style={{fontSize: 120, fontWeight: 900, lineHeight: 1, letterSpacing: -2}}>JAHRE</div>
        <div style={{display: "inline-block", marginTop: 50, padding: "16px 36px", borderRadius: 18, background: p.accent, color: p.bg, fontSize: 104, fontWeight: 900}}>
          GRUND: ?
        </div>
      </div>
      <Bit palette={p} size={210} look={-0.8} style={{position: "absolute", right: 160, top: COVER_BAND.bottom - 300}} />
    </AbsoluteFill>
  </SafeCheck>
);
