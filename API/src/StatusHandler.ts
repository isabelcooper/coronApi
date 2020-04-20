import {Handler} from "http4js/core/HttpMessage";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {buildStatus, StatusWriter} from "./StatusStore";

export class StatusHandler implements Handler {
  constructor(private statusWriter: StatusWriter){};
   public async handle(req: Req): Promise<Res> {
     const body = JSON.parse(req.body.bodyString());
     const status = buildStatus({...body, updated: new Date(body.updated)});
     await this.statusWriter.store(status);
    return ResOf(200)
  }
}
