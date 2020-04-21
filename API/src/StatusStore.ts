import {Status} from "../../shared/Status";

export class InMemoryStatusReader implements StatusReader {
  constructor(public statusStore: Status[]) {
  }

  public async readAll(): Promise<Status[]> {
    return this.statusStore;
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
