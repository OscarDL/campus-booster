import { SupportedLangs } from './types/settings';


export const colors = {
  accent: '#3b2f92',
  accentRGB: '80, 60, 180'
};


export const dayjsLocales = {
  en: () => import('dayjs/locale/en'),
  fr: () => import('dayjs/locale/fr')
};


const supportedLangs: SupportedLangs[] = ['en', 'fr'];
export const values = {
  supportedLangs,

  roles: {
    student: 1,
    professor: 2,
    fullProfessor: 3,
    company: 4,
    administration: 5,
    campusBoosterAdmin: 6
  },

  categories: [
    'summary',
    'subjects',
    'marks',
    'members',
    'calendar',
    'internships',
    'accounting',
    'admin',
    'tools'
  ],

  maxMobileWidth: 768
};
