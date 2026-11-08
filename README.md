# શુભ વિવાહ — Ayush ❤️ Priya

Digital kankotri built with Next.js + Tailwind, styled after the Kishan kankotri
(warm sand base, cocoa text, antique gold, rose accents).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Flow
Doors → tap "કંકોત્રી ખોલો" → doors open → scratch the gold card →
"Ram Ram Jay Raja Ram" starts + flower burst → invitation.

## Files to add
| What | Put it at |
|---|---|
| Groom photo (portrait, ~3:4) | `public/images/groom.jpg` |
| Bride photo (portrait, ~3:4) | `public/images/bride.jpg` |
| Ram Ram Jay Raja Ram song | `public/audio/ram-ram-jay-raja-ram.mp3` |

Until the photos are added, a gold initial (આ / પ) shows inside the arch. Without the MP3 the music button hides itself.

## Editing details
Names, parents, events and the countdown time live in `src/data/wedding.ts`.
Add `time: '08:00 AM'` to any event and its time appears on the right of the card.
