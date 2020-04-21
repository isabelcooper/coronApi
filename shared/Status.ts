import {Random} from "../API/utils/Random";

enum FlightStatus {
  Domestic = "domestic",
  Full = "full",
  Partial = "partial"
}

enum TravelAdvice {
  EnforcedLockdown = "enforcedLockdown",
  RecommendedLockdown = "recommendedLockdown",
  PartialWFH = "partialWFH",
  OpenTravel = "openTravel"
}

export interface Status {
  country: string;
  flightStatus: FlightStatus;
  // excludedDestinations: string[];
  travelAdvice: TravelAdvice;
  updated: Date;
}

export function buildStatus(partial?: Partial<Status>): Status {
  return {
    country: Random.string('country'),
    flightStatus: Random.oneOf([FlightStatus.Full, FlightStatus.Partial, FlightStatus.Domestic]),
    // excludedDestinations: [Random.string('country')],
    travelAdvice: Random.oneOf([TravelAdvice.EnforcedLockdown, TravelAdvice.PartialWFH, TravelAdvice.OpenTravel, TravelAdvice.RecommendedLockdown]),
    updated: Random.date(),
    ...partial
  }
}