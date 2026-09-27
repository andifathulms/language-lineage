# Share-card fonts

Only the `og.png` route handlers use these; the site itself loads its faces
through `next/font` (see `src/lib/fonts.ts`). They are committed rather than
fetched so a build never needs the network.

- `Fraunces-Semibold.ttf`, `Fraunces-Regular.ttf` — static instances of
  [Fraunces](https://github.com/undercasetype/Fraunces), pinned at
  `wght=600 / 400`, `SOFT=60`, `opsz=144`, `WONK=0`:

  ```
  fonttools varLib.instancer Fraunces[SOFT,WONK,opsz,wght].ttf \
    wght=600 SOFT=60 opsz=144 WONK=0 -o Fraunces-Semibold.ttf
  ```

  Satori (the renderer behind `next/og`) cannot read a variable font's `fvar`
  table, so the variable master cannot be shipped here as-is.

- `IBMPlexMono-Regular.ttf` — the label face, already static.

Both are SIL Open Font License 1.1; see `OFL-Fraunces.txt` and
`OFL-IBMPlexMono.txt`.
