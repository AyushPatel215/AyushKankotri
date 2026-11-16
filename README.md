# શુભ વિવાહ — Ayush ❤️ Priya

Digital kankotri built with Next.js + Tailwind, styled after the Kishan kankotri
(warm sand base, cocoa text, antique gold, rose accents).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Flow
Temple doorway → "Tap to Enter" → carved doors swing open into light → sealed kankotri appears →
tap the seal ("Ram Ram Jay Raja Ram" starts) → it opens straight into the website: golden Ganesha
welcome page → groom → bride → invitation → functions → blessings → final. Normal scrolling from there.

## Files to add
| What | Put it at |
|---|---|
| Groom photo (portrait, ~3:4) | `public/images/groom.jpg` |
| Bride photo (portrait, ~3:4) | `public/images/bride.jpg` |
| Ram Ram Jay Raja Ram song | `public/audio/main-ram-ram.mp3 (+ intro-ram-ram.mp3)` |

Until the photos are added, a gold initial (આ / પ) shows inside the arch. Without the MP3 the music button hides itself.

## Editing details
Names, parents, events and the countdown time live in `src/data/wedding.ts`.
Add `time: '08:00 AM'` to any event and its time appears on the right of the card.

## Opening letter (phase 1)

The site now opens on a sealed gatefold invitation (`src/components/InvitationLetter.tsx`).
Tapping the card or the wax seal presses the seal, swings the two panels open in 3D and settles on a soft ivory screen.

- **Names** — `BRIDE.en` / `GROOM.en` in `src/data/wedding.ts`
- **Wording** — `LETTER` in `src/data/wedding.ts`
- **Peacock / wax seal artwork** — built-in SVGs in `src/components/Peacock.tsx` and `src/components/WaxSeal.tsx`.
  To use your own, put a transparent PNG/SVG in `public/images/` and set `LETTER.peacockImage` / `LETTER.sealImage`
  (e.g. `'/images/peacock.png'`). Square artwork works best for the seal.
- **Connecting the next stage** — in `src/app/page.tsx`, `handleLetterOpened` runs when the ivory screen is reached
  and brings in the temple doorway. `InvitationLetter` also accepts `onOpenStart`, which runs inside the guest's tap.
- Styles live at the end of `src/app/globals.css` under "Opening invitation letter".

## Temple doorway (phase 2)

`src/components/temple/` — an original SVG scene drawn in a 1600 × 1000 space (phones crop the sides):

- `TempleBack.tsx` — wall, side niches with diyas, marble floor, the divine light + rays behind the doors
- `DoorLeaf.tsx` — one carved bronze-and-gold leaf (tree-of-life vine, rosettes, ring knocker); mirrored for the right leaf
- `TempleFront.tsx` — stone cusped arch, Ganesh medallion, marigold toran, kumkum swastik with શુભ / લાભ, pillars,
  bougainvillea, brass urns with flowers, rangoli and diyas
- `TempleDoors.tsx` — lanterns, glows, floating light and petals, "Tap to Enter", and the opening sequence:
  seam of light → knockers swing → doors swing inward → camera moves through the doorway → scratch card
- Styles: end of `src/app/globals.css` under "Temple doorway"; timings in `TIMING` inside `TempleDoors.tsx`

## Welcome page + groom / bride sections

- `src/components/WelcomeSection.tsx` — first page of the website: the golden Ganesha picture
  (`public/images/ganesha-wedding.jpg`, an optimised copy of "Golden Ganesha Wedding Invitation.png") with
  ॥ श्री गणेशाय नमः ॥, શુભ વિવાહ, names, message, dates, નિમંત્રક and the countdown on its plain lower area.
  To use another picture, change `BOOKLET.ganeshaImage`, `ganeshaImageRatio` (height ÷ width),
  `textStart` (where the text begins, as a fraction of the picture height) and `pageColor`.
- `src/components/PersonSection.tsx` — "Introducing the Groom / Bride" with the gold arch photo frame.
- Artwork in `src/components/invitation/` (PhotoFrame, Ornaments).
- All text, names, parents and photos come from `weddingDetails` and `BOOKLET` in `src/data/wedding.ts`.
  Empty values show a soft placeholder.
- **Photos** — `public/images/groom.jpg` and `public/images/bride.jpg`; only cropped to the frame, never altered.
  Adjust `photoAlign` (`'xMidYMin'` keeps the top) if a face is cut off.
