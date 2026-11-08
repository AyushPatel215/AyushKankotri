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
  },
  {
    date: '21 February 2027',
    dateGu: '૨૧ ફેબ્રુઆરી ૨૦૨૭',
    weekday: 'Sunday',
    weekdayGu: 'રવિવાર',
    events: [{ name: 'જાન પ્રસ્થાન', nameEn: 'Jaan Prasthan' }],
  },
];
