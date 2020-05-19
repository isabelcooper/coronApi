import {InMemoryTravelStatusWriter} from "../travelStatusStore/StatusStore";
import {ReqOf} from "http4js/core/Req";
import {TravelStatusStorageHandler} from "./TravelStatusStorageHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {buildTravelStatus, DomesticTravel, TravelStatus} from "../travelStatusStore/TravelStatus";
import {Random} from "../../utils/Random";
import {TravelBansStorageHandler} from "./TravelBansStorageHandler";
import {Clock, FixedClock} from "../../utils/Clock";

export interface TravelBan {
  country_name: string,
  country_status: DomesticTravel,
  start_date: Date,
}

export function buildTravelBan() : TravelBan {
  return {
      start_date: Random.date(),
      country_name: Random.string('name'),
      country_status: Random.oneOf([DomesticTravel.GlobalBan, DomesticTravel.Open, DomesticTravel.Restricted]),
    }
}

function convertTravelBanToCountryStatus(iso: string, isoTravelBan: TravelBan, clock: Clock) {
  return buildTravelStatus({
    iso,
    country: isoTravelBan.country_name,
    startDate: isoTravelBan.start_date,
    quarantineOnArrival: null,
    updated: new Date(clock.now()),
    noEntryCountries: null,
    domesticTravel: isoTravelBan.country_status
  });
}

describe('TravelBansStorageHandler', () => {
  it('should store a json blob of countries as travel statuses', async () => {
    let statusStore: [] = [];
    const statusWriter = new InMemoryTravelStatusWriter(statusStore);
    let clock = new FixedClock();
    const travelBansHandler = new TravelBansStorageHandler(statusWriter, clock);

    const iso1TravelBan = buildTravelBan();
    const iso2TravelBan = buildTravelBan();
    const iso3TravelBan = buildTravelBan();

    const travelBans : { [key: string]: TravelBan} = {
     'iso1': iso1TravelBan,
     'iso2': iso2TravelBan,
     'iso3': iso3TravelBan,
    };

    const res = await travelBansHandler.handle(ReqOf(Method.POST, '/travel-bans', JSON.stringify(travelBans)));

    expect(res.status).to.eql(200);

    expect(statusWriter.travelStatuses).to.eql([
      convertTravelBanToCountryStatus('iso1', iso1TravelBan, clock),
      convertTravelBanToCountryStatus('iso2', iso2TravelBan, clock),
      convertTravelBanToCountryStatus('iso3', iso3TravelBan, clock)
      ]);
  });
});
