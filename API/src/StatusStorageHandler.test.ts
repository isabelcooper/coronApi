import {InMemoryTravelStatusWriter} from "./StatusStore";
import {ReqOf} from "http4js/core/Req";
import {TravelStatusStorageHandler} from "./TravelStatusStorageHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {buildTravelStatus} from "./TravelStatus";

describe('StatusStorageHandler', () => {
  it('should store a status', async () => {
    let statusStore: [] = [];
    const statusWriter = new InMemoryTravelStatusWriter(statusStore);
    const statusHandler = new TravelStatusStorageHandler(statusWriter);

    const status = buildTravelStatus();
    const res = await statusHandler.handle(ReqOf(Method.POST, '/status', JSON.stringify(status)));

    expect(res.status).to.eql(200);
    expect(statusWriter.travelStatuses).to.eql([status]);
  });
});
