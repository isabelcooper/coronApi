import {HttpClient} from "http4js/client/HttpClient";
import {Server} from "./server";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter} from "./StatusStore";
import {TravelStatusStorageHandler} from "./TravelStatusStorageHandler";
import {SqlTravelStatusWriter} from "./SqlStatusStore";
import {Status} from "http4js/core/Status";
import {TravelStatusRetrievalHandler} from "./TravelStatusRetrievalHandler";
import {buildTravelStatus, TravelStatus} from "../../shared/TravelStatus";

describe('Server', () => {
  const httpClient = HttpClient;
  const port = 1111;
  let server: Server;
  let travelStatusStorageHandler: TravelStatusStorageHandler;
  let travelStatusRetrievalHandler: TravelStatusRetrievalHandler;
  let travelStatusStore: TravelStatus[];

  beforeEach(async () => {
    travelStatusStore = [];
    travelStatusStorageHandler = new TravelStatusStorageHandler(new InMemoryTravelStatusWriter(travelStatusStore));
    travelStatusRetrievalHandler = new TravelStatusRetrievalHandler(new InMemoryTravelStatusReader(travelStatusStore));
    server = new Server(travelStatusStorageHandler, travelStatusRetrievalHandler, port);
    server.start();
  });

  afterEach(async () => {
    server.stop();
  });

  it('should respond 200 on health', async () => {
    const response = await httpClient(ReqOf(Method.GET,`http://localhost:${port}/health`));
    expect(response.status).to.eql(200);
  });

  it('should allow a record to be stored', async () => {
    const travelStatus = buildTravelStatus();

    const response = await httpClient(ReqOf(
      Method.POST,
      `http://localhost:${port}/status`,
      JSON.stringify(travelStatus)
    ));
    expect(response.status).to.eql(200);
  });
  it('should retrieve all records', async () => {
    const response = await httpClient(ReqOf(
      Method.GET,
      `http://localhost:${port}/status`
    ));
    expect(response.status).to.eql(200);
  });

  it('should retrieve status for a specific country', async () => {
    const travelStatus = buildTravelStatus();
    const travelStatus2 = buildTravelStatus();
    travelStatusStore.push(travelStatus);
    travelStatusStore.push(travelStatus2);

    const response = await httpClient(ReqOf(
      Method.GET,
      `http://localhost:${port}/status/${travelStatus.country}`
    ));
    expect(response.status).to.eql(200);
    let body = JSON.parse(response.bodyString());
    expect(body.country).to.eql(travelStatus.country);
  });
});
