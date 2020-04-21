import {Status} from "../../../shared/Status";
import {Clock} from "http4js/core/Clock";

export interface Result<T = any> {
  success: boolean;
  message?: string;
  payload: T;
}

export interface CoronApiClient {
  getAllStatuses(): Promise<Result>;
  sendStatus(status: Status): Promise<Result>;
  storedStatuses?: Status[];
}

export class InMemoryCoronApiClient implements CoronApiClient {
  constructor(public storedStatuses: Status[] =[], private clock: Clock = Date) {};

  private static async success(): Promise<Result> {
    return {
      success: true,
      payload: ''
    }
  }

  public async getAllStatuses(): Promise<Result> {
    return {
      success: true,
      payload: this.storedStatuses
    }
  }

  public async sendStatus(status: Status): Promise<Result> {
    await this.storedStatuses.push(status);
    return InMemoryCoronApiClient.success()
  }
}
export class AlwaysFailCoronApiClient implements CoronApiClient {

  private static async success(): Promise<Result> {
    return {
      success: false,
      payload: '',
      message: 'error'
    }
  }

  public async getAllStatuses(): Promise<Result> {
    return AlwaysFailCoronApiClient.success()
  }

  public async sendStatus(status: Status): Promise<Result> {
    return AlwaysFailCoronApiClient.success()
  }
}
