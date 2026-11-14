import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes, Marcellus, Noto_Serif_Devanagari, Pinyon_Script, Rasa } from 'next/font/google';
import './globals.css';

const rasa = Rasa({
  subsets: ['gujarati', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rasa',
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
// only for the Sanskrit invocation on the booklet's first page
const deva = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['500', '600'],
  variable: '--font-deva',
  display: 'swap',
});
// groom / bride portrait cards
const marcellus = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-marcellus', display: 'swap' });
const vibes = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-vibes', display: 'swap' });
const pinyon = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-pinyon', display: 'swap' });

export const metadata: Metadata = {
  title: 'શુભ વિવાહ | Ayush ❤️ Priya',
  description: 'શુભ વિવાહ — Ayush ❤️ Priya | 20 - 21 February 2027',
  openGraph: {
    title: 'શુભ વિવાહ | Ayush ❤️ Priya',
    description: 'આપ સાદર આમંત્રિત છો · 20 - 21 February 2027',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F4E6D8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" className={`${rasa.variable} ${cormorant.variable} ${pinyon.variable} ${deva.variable} ${marcellus.variable} ${vibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
