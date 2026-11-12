import {continueRender, delayRender, staticFile} from "remotion";

/**
 * Inter (SIL Open Font License 1.1), bundled in public/fonts (variable weight,
 * latin + latin-ext, from @fontsource-variable/inter 5.2.5) so every machine,
 * online or not, renders the same glyph widths (§6b). A font borrowed from the
 * OS or fetched at render time can silently change line breaks.
 *
 * Rendering is blocked until both files have loaded, so frame 0 never flashes
 * a fallback face.
 */
let loaded = false;

const FILES = [
  {file: "fonts/inter-latin-wght-normal.woff2", range: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"},
  {file: "fonts/inter-latin-ext-wght-normal.woff2", range: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF"},
];

export const loadFont = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading bundled Inter");
  Promise.all(
    FILES.map(({file, range}) => {
      const face = new FontFace("Inter", `url(${staticFile(file)}) format("woff2")`, {weight: "100 900", style: "normal", unicodeRange: range});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error("Inter failed to load", e);
      continueRender(handle);
    });
};
