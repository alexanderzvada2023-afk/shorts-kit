# public/fonts

| File | Font | Licence | From |
| --- | --- | --- | --- |
| `inter-latin-wght-normal.woff2`, `inter-latin-ext-wght-normal.woff2` | Inter, variable weight 100–900 | SIL Open Font License 1.1 (`Inter-OFL.txt`) | npm `@fontsource-variable/inter` 5.2.5 |

Loaded by `src/shared/font.ts` with `@font-face` + `staticFile`, so renders need no
network (§6b). To use another font, put the file here, load it there, change
`FONT.sans` in `src/shared/theme.ts`, and record it and its licence in this table.
A system font licensed "for use on this platform" (e.g. Apple's SF Pro) may not be
redistributed or rendered elsewhere.
