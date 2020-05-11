import {Handler} from "http4js/core/HttpMessage";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {StatusReader, StatusWriter} from "./StatusStore";
import {buildTravelStatus} from "../../shared/TravelStatus";

export class TravelStatusRetrievalHandler implements Handler {
  constructor(private statusReader: StatusReader){};
   public async handle(req: Req): Promise<Res> {
     const pathname = req.uri.path().split('/status/')[1] || undefined;

     const statuses = pathname
       ? await this.statusReader.read(pathname)
       : await this.statusReader.readAll();

     return ResOf(200, JSON.stringify(statuses))
  }
}
