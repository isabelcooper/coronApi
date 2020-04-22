import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter} from "./StatusStore";
import {ReqOf} from "http4js/core/Req";
import {TravelStatusStorageHandler} from "./TravelStatusStorageHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {TravelStatusRetrievalHandler} from "./TravelStatusRetrievalHandler";
import {Dates} from "../utils/Dates";
import {buildTravelStatus} from "../../shared/TravelStatus";

describe('StatusRetrievalHandler', () => {
  it('should retrieve all statuses', async () => {
    let status1 = buildTravelStatus();
    let statusStore: any[] = [status1];
    const statusReader = new InMemoryTravelStatusReader(statusStore);
    const statusHandler = new TravelStatusRetrievalHandler(statusReader);

    const res = await statusHandler.handle(ReqOf(Method.GET, '/status'));

    expect(res.status).to.eql(200);
    //TODO:
    // expect(JSON.parse(res.bodyString())).to.eql([status1]);
    // expect(statusReader.statusStore).to.eql([status1]);
  });
});
