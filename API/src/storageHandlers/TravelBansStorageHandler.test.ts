import {InMemoryTravelStatusWriter} from "../travelStatusStore/StatusStore";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {buildTravelStatus, DomesticTravel} from "../travelStatusStore/TravelStatus";
import {Random} from "../../utils/Random";
import {TravelBansStorageHandler} from "./TravelBansStorageHandler";
import {Clock, FixedClock} from "../../utils/Clock";

export interface TravelBan {
  country_name: string,
  country_status: DomesticTravel,
  updated: Date,
  start_date: Date | null,
}

export function buildTravelBan(partial?: Partial<TravelBan>): TravelBan {
  return {
    start_date: Random.date(),
    updated: Random.date(),
    country_name: Random.string('name'),
    country_status: Random.oneOf([DomesticTravel.GlobalBan, DomesticTravel.Open, DomesticTravel.Restricted]),
    ...partial
  }
}

function convertTravelBanToCountryStatus(iso: string, isoTravelBan: TravelBan, clock: Clock) {
  return buildTravelStatus({
    iso,
    country: isoTravelBan.country_name,
    startDate: isoTravelBan.start_date,
    quarantineOnArrival: null,
    updated: isoTravelBan.updated || new Date(clock.now()),
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

    const iso1TravelBan = buildTravelBan({start_date: null, updated: new Date()});
    const iso2TravelBan = buildTravelBan();
    const iso3TravelBan = buildTravelBan();

    const travelBans: { [key: string]: TravelBan } = {
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
