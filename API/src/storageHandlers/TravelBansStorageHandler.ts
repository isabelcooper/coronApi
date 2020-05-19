import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {StatusWriter} from "../travelStatusStore/StatusStore";
import {buildTravelStatus} from "../travelStatusStore/TravelStatus";
import {Clock} from "../../utils/Clock";

export class TravelBansStorageHandler {
  constructor(private statusWriter: StatusWriter, private clock : Clock = Date) {};

  public async handle(req: Req): Promise<Res> {
    const body = JSON.parse(req.body.bodyString());
    const keys = Object.keys(body);
    let travelStatuses = [];
    for (const key of keys) {
      travelStatuses.push(
        buildTravelStatus({
          iso: key,
          country: body[key].country_name,
          domesticTravel: body[key].country_status,
          noEntryCountries: null,
          quarantineOnArrival: null,
          updated: new Date(this.clock.now()),
          startDate: new Date(body[key].start_date) || null,
        }))
    }

    await this.statusWriter.storeAll(travelStatuses);
    return ResOf(200)
  }
}
