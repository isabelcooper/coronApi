import {SimpleHttpClient} from "./SimpleHttpClient";
import {Req, ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {Status} from "../../../shared/Status";
import {CoronApiClient, Result} from "./CoronApi";

export class CoronApiHttpClient implements CoronApiClient {
  private httpClient = new SimpleHttpClient();

  constructor(private coronApi: string) {}

  private async makeRequest(req: Req): Promise<Result> {
    const res = await this.httpClient.handle(req);
    if (res.status !== 200) {
      console.log(res.bodyString());
    }
    return res.status !== 200 ? {
      success: false,
      payload: res.bodyString()
    } : {
      success: true,
      payload: res.bodyString() || 'ok'
    };
  }

  public async getAllStatuses(): Promise<Result> {
    return await this.makeRequest(ReqOf(Method.GET, `${this.coronApi}/status`));
  }

  public async sendStatus(status: Status): Promise<Result> {
    return await this.makeRequest(ReqOf(Method.POST, `${this.coronApi}/status`, JSON.stringify(status)));
  }
}
