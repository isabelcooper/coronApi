import {InMemoryTravelStatusReader, StatusReader} from "../travelStatusStore/StatusStore";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {TravelStatusRetrievalHandler} from "./TravelStatusRetrievalHandler";
import {buildTravelStatus, TravelStatus} from "../travelStatusStore/TravelStatus";

describe('StatusRetrievalHandler', () => {
  let statusStore: any[];
  let statusReader: StatusReader;
  let statusHandler: TravelStatusRetrievalHandler;
  let status1: TravelStatus;
  let status2: TravelStatus;

  beforeEach(() => {
    status1 = buildTravelStatus();
    status2 = buildTravelStatus();
    statusStore = [status1, status2];
    statusReader = new InMemoryTravelStatusReader(statusStore);
    statusHandler = new TravelStatusRetrievalHandler(statusReader);
  });

  it('should retrieve all statuses', async () => {
    const res = await statusHandler.handle(ReqOf(Method.GET, '/status'));

    expect(res.status).to.eql(200);
    const [retrievedStatus1, retrievedStatus2] = JSON.parse(res.bodyString());
    expect([
      {...retrievedStatus1, updated: new Date(retrievedStatus1.updated), startDate: new Date(retrievedStatus1.startDate)},
      {...retrievedStatus2, updated: new Date(retrievedStatus2.updated), startDate: new Date(retrievedStatus2.startDate)}
      ]
    ).to.eql([status1, status2]);
  });

  it('should retrieve status for a specific country', async () => {
    const res = await statusHandler.handle(ReqOf(Method.GET, `/status/${status1.country}`));
    expect(res.status).to.eql(200);
    const body = JSON.parse(res.bodyString());
    expect(body.country).to.eql(status1.country);
  });
});
