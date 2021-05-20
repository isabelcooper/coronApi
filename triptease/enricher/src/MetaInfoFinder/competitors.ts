import { Random } from '../../../../shared/src/Random';

export interface Competitor {
  name: string;
  matcher: string;
}

export function buildCompetitor(partial: Partial<Competitor> = {}): Competitor {
  return {
    name: Random.string('name'),
    matcher: Random.string('matcher'),
    ...partial,
  };
}

export const competitors: Competitor[] = [
  {
    name: 'Data Seekers',
    matcher: 'global-dot-rescue-seeker.appspot.com',
  },
  {
    name: 'Add Shoppers / Cybba',
    matcher: 'addshoppers',
  },
  {
    name: 'About Hotelier',
    matcher: 'abouthotelier',
  },
  {
    name: 'The Guest Book',
    matcher: 'theguestbook',
  },
  {
    name: 'Voyat',
    matcher: 'voyat.com',
  },
  {
    name: 'Booking Direction',
    matcher: 'bookingdirection.com',
  },
  {
    name: 'VE Interactive',
    matcher: 'veinteractive',
  },
  {
    name: 'The Hotels Network',
    matcher: 'thehotelsnetwork',
  },
  {
    name: 'Hotel Chump',
    matcher: 'hotelchamp',
  },
  {
    name: 'Booklyng',
    matcher: 'booklyng',
  },
  {
    name: 'Paxxio',
    matcher: 'paxx.io',
  },
  {
    name: 'Tawk.to',
    matcher: 'tawk.to',
  },
  {
    name: 'Sojern',
    matcher: 'sojern',
  },
  {
    name: 'Google Tag Manager',
    matcher: 'googletagmanager',
  },
  {
    name: 'Adobe Tag Manager',
    matcher: 'adobedtm',
  },
  {
    name: 'Tealium Tag Manager',
    matcher: 'tiqcdn.com',
  },
  {
    name: 'Criteo',
    matcher: 'criteo.com',
  },
  {
    name: 'NextRoll',
    matcher: 'adroll.com',
  },
];
