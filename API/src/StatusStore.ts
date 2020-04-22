import {TravelStatus} from "../../shared/TravelStatus";

export class InMemoryTravelStatusReader implements StatusReader {
  constructor(public travelStatuses: TravelStatus[]) {
  }

  public async readAll(): Promise<TravelStatus[]> {
    return this.travelStatuses;
  }

}

export interface StatusReader {
  readAll(): Promise<TravelStatus[]>;
}

export interface StatusWriter {
  store(status: TravelStatus): Promise<void>;
}

export class InMemoryTravelStatusWriter implements StatusWriter {
  constructor(public travelStatuses: TravelStatus[]) {
  }

  public async store(status: TravelStatus): Promise<void> {
    this.travelStatuses.push(status);
  }

}
