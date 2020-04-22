import {Handler} from "http4js/core/HttpMessage";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {StatusWriter} from "./StatusStore";
import {buildTravelStatus} from "../../shared/TravelStatus";

export class TravelStatusStorageHandler implements Handler {
  constructor(private statusWriter: StatusWriter){};
   public async handle(req: Req): Promise<Res> {
     const body = JSON.parse(req.body.bodyString());
     const status = buildTravelStatus({...body, updated: new Date(body.updated)});
     await this.statusWriter.store(status);
    return ResOf(200)
  }
}
