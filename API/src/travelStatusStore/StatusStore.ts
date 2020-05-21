import {TravelStatus} from "./TravelStatus";

export interface StatusReader {
  readAll(): Promise<TravelStatus[]>;

  read(iso: string): Promise<TravelStatus | null>;
}

export class InMemoryTravelStatusReader implements StatusReader {
  constructor(public travelStatuses: TravelStatus[]) {
  }

  public async readAll(): Promise<TravelStatus[]> {
    return this.travelStatuses
  }

  public async read(iso: string): Promise<TravelStatus | null > {
    return this.travelStatuses.find(status => status.iso === iso) || null;
  }
}

export interface StatusWriter {
  store(status: TravelStatus): Promise<void>;

  storeAll(travelStatuses: TravelStatus[]): Promise<void>;
}

export class InMemoryTravelStatusWriter implements StatusWriter {
  constructor(public travelStatuses: TravelStatus[] =[]) {
  }

  public async store(status: TravelStatus): Promise<void> {
    for(const key of this.travelStatuses.keys()) {
      if(this.travelStatuses[key].iso == status.iso) {
        this.travelStatuses[key] = status;
        return;
      }
    }
    this.travelStatuses.push(status);
  }

  public async storeAll(travelStatuses: TravelStatus[]): Promise<void> {
    this.travelStatuses.push(...travelStatuses);
  }
}
