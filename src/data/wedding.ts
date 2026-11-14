export interface WeddingEvent {
  name: string;
  nameEn: string;
  /** e.g. "08:00 AM" — leave out until the muhurat is final; the card adapts */
  time?: string;
}

export interface DaySchedule {
  date: string;
  dateGu: string;
  weekday: string;
  weekdayGu: string;
  events: WeddingEvent[];
  /**
   * optional full-page painting for this day:
   * 'couple' sets the couple's names on it (palace scene), 'ceremonies' lists the day's ceremonies (temple arch)
   */
  scene?: { image: string; layout: 'couple' | 'ceremonies' };
}

// Countdown target — first function of the wedding (ગણેશ સ્થાપના, 20 Feb 2027).
// Change the time once the muhurat is fixed.
export const WEDDING_DATE = '2027-02-20T08:00:00+05:30';

// Put the song at public/audio/ram-ram-jay-raja-ram.mp3 — the music button hides itself if it is missing
export const MUSIC_SRC = '/audio/ram-ram-jay-raja-ram.mp3';

export const GROOM = {
  en: 'Ayush',
  fullEn: 'Ayush Patel',
  gu: 'આયુષ',
  photo: '/images/groom.jpg',
};

export const BRIDE = {
  en: 'Priya',
  fullEn: 'Priya Patel',
  gu: 'પ્રિયા',
  photo: '/images/bride.jpg',
};

export const PARENTS = {
  fatherGu: 'શ્રી દિપકભાઈ અમૃતલાલ પટેલ',
  fatherEn: 'Shri Dipakbhai Amrutlal Patel',
  motherGu: 'શ્રીમતી શિલ્પાબેન દિપકભાઈ પટેલ',
  motherEn: 'Smt. Shilpaben Dipakbhai Patel',
  familyGu: 'સમસ્ત પટેલ પરિવાર',
};

export const SCHEDULE: DaySchedule[] = [
  {
    date: '20 February 2027',
    dateGu: '૨૦ ફેબ્રુઆરી ૨૦૨૭',
    weekday: 'Saturday',
    weekdayGu: 'શનિવાર',
    events: [
      { name: 'ગણેશ સ્થાપના', nameEn: 'Ganesh Sthapana' },
      { name: 'ગ્રહ શાંતિ', nameEn: 'Grah Shanti' },
      { name: 'જમણવાર', nameEn: 'Jamanvar (Lunch)' },
      { name: 'મામેરું', nameEn: 'Mameru' },
      { name: 'હલ્દી રસમ', nameEn: 'Haldi Ceremony' },
    ],
    scene: { image: '/images/temple-arch.jpg', layout: 'ceremonies' },
  },
  {
    date: '21 February 2027',
    dateGu: '૨૧ ફેબ્રુઆરી ૨૦૨૭',
    weekday: 'Sunday',
    weekdayGu: 'રવિવાર',
    events: [{ name: 'જાન પ્રસ્થાન', nameEn: 'Jaan Prasthan' }],
    scene: { image: '/images/palace-scene.jpg', layout: 'couple' },
  },
];

// The sealed kankotri card. Names come from BRIDE.en / GROOM.en above; `background` is the
// picture printed on the card. To use your own seal artwork set sealImage, e.g. '/images/seal.png'.
export const LETTER = {
  titleGu: 'શુભ વિવાહ',
  blessing: 'With the blessings of Lord Ganesha and our families.',
  invite: 'You are cordially invited to celebrate our wedding.',
  hint: 'Tap to open your invitation',
  // Greeting written at the top of the card, inside the arch
  welcomeEyebrow: '॥ આપ સાદર આમંત્રિત છો ॥',
  welcomeTitle: 'You are most cordially invited',
  welcomeText: 'With warm regards and folded hands, we humbly request the honour of your presence at our wedding.',
  background: '/images/temple-arch.jpg',
  // Revealed inside the card when it opens, held for a moment before the Ganesha page
  insideImage: '/images/radha-krishna.jpg',
  sealImage: null as string | null,
};

// ---------------------------------------------------------------------------
// Invitation booklet (the three pages after the temple doors)
// ---------------------------------------------------------------------------
// One place for everything the booklet shows. Leave a value as '' when it is not
// known yet — the page shows a soft placeholder instead of inventing details.
// photoAlign decides which part of the photo stays visible when it is cropped
// into the frame (the photo itself is never altered): e.g. 'xMidYMin' keeps the top.
export const weddingDetails = {
  groom: {
    name: GROOM.fullEn,
    nameGu: 'ચિ. આયુષ',
    fatherName: PARENTS.fatherEn,
    motherName: PARENTS.motherEn,
    photo: GROOM.photo,
    photoAlign: 'xMidYMin',
  },
  bride: {
    name: BRIDE.fullEn,
    nameGu: 'ચિ. સૌ. કાં. પ્રિયા',
    fatherName: '', // bride's father's full name
    motherName: '', // bride's mother's full name
    photo: BRIDE.photo,
    photoAlign: 'xMidYMin',
  },
};

export const BOOKLET = {
  invocation: '॥ श्री गणेशाय नमः ॥',
  titleGu: 'શુભ વિવાહ',
  titleEn: 'Shubh Vivah',
  message:
    'With the divine blessings of Lord Ganesha and the love and blessings of our families, we cordially invite you to celebrate the auspicious occasion of our wedding.',
  presence: 'Your presence and blessings will make our celebration even more special.',
  hostsLabel: 'નિમંત્રક',
  hosts: [PARENTS.fatherGu, PARENTS.motherGu],
  family: PARENTS.familyGu,
  // Background of the first page. The text starts where the picture's plain lower area begins
  // (textStart = fraction of the image height); pageColor continues the page below the picture.
  ganeshaImage: '/images/ganesha-wedding.jpg',
  ganeshaImageRatio: 1536 / 1024, // height / width of the image
  textStart: 0.68,
  pageColor: '#fad19e',
};
