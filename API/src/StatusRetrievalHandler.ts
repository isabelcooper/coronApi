import {Handler} from "http4js/core/HttpMessage";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {buildStatus, StatusReader, StatusWriter} from "./StatusStore";

export class StatusRetrievalHandler implements Handler {
  constructor(private statusReader: StatusReader){};
   public async handle(req: Req): Promise<Res> {
     const statuses = await this.statusReader.readAll();
     return ResOf(200, JSON.stringify(statuses))
  }
}
