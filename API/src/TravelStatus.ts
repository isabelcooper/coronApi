import {Random} from "../utils/Random";

enum DomesticTravel {
  GlobalBan = "global_ban",
  Restricted = "restricted",
  Open = "open"
}

export interface TravelStatus {
  iso: string;
  country: string;
  domesticTravel: DomesticTravel;
  noEntryCountries: string[];
  quarantineOnArrival: boolean;
  startDate: Date;
  updated: Date;
}

export function buildTravelStatus(partial?: Partial<TravelStatus>): TravelStatus {
  return {
    iso: Random.integer(100).toString(), // random string max 3 chars
    country: Random.string('country'),
    domesticTravel: Random.oneOf([DomesticTravel.Restricted, DomesticTravel.Open, DomesticTravel.GlobalBan]),
    noEntryCountries:[],
    quarantineOnArrival: Random.boolean(),
    startDate: Random.date(),
    updated: Random.date(),
    ...partial
  }
}
