import {Random} from "../utils/Random";

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

export class InMemoryStatusReader implements StatusReader {
  constructor(private store: Status[]) {
  }

  public async readAll(): Promise<Status[]> {
    return this.store;
  }

}

export interface StatusReader {
  readAll(): Promise<Status[]>;
}

export interface StatusWriter {
  store(status: Status): Promise<void>;
}

export class InMemoryStatusWriter implements StatusWriter {
  constructor(public statusStore: Status[]) {
  }

  public async store(status: Status): Promise<void> {
    this.statusStore.push(status);
  }

}
