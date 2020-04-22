import {TravelStatus} from "../../../shared/TravelStatus";
import {Clock} from "http4js/core/Clock";

export interface Result<T = any> {
  success: boolean;
  message?: string;
  payload: T;
}

export interface CoronApiClient {
  getAllStatuses(): Promise<Result>;
  sendStatus(status: TravelStatus): Promise<Result>;
}

export class InMemoryCoronApiClient implements CoronApiClient {
  constructor(public storedStatuses: TravelStatus[] =[], private clock: Clock = Date) {};

  private static async success(): Promise<Result> {
    return {
      success: true,
      payload: ''
    }
  }

  public async getAllStatuses(): Promise<Result> {
    return {
      success: true,
      payload: JSON.stringify(this.storedStatuses)
    }
  }

  public async sendStatus(status: TravelStatus): Promise<Result> {
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

  public async sendStatus(status: TravelStatus): Promise<Result> {
    return AlwaysFailCoronApiClient.success()
  }
}
