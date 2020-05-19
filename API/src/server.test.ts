import {HttpClient} from "http4js/client/HttpClient";
import {Server} from "./server";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter, StatusWriter} from "./travelStatusStore/StatusStore";
import {TravelStatusStorageHandler} from "./storageHandlers/TravelStatusStorageHandler";
import {TravelStatusRetrievalHandler} from "./retrievalHandlers/TravelStatusRetrievalHandler";
import {buildTravelStatus, TravelStatus} from "./travelStatusStore/TravelStatus";
import {buildTravelBan} from "./storageHandlers/TravelBansStorageHandler.test";
import {TravelBansStorageHandler} from "./storageHandlers/TravelBansStorageHandler";
import {Random} from "../utils/Random";
import {BasicAuthAuthenticator} from "./auth/Authenticator";

describe('Server', () => {
  const httpClient = HttpClient;
  const port = 1111;
  let server: Server;
  let travelStatusStorageHandler: TravelStatusStorageHandler;
  let travelBansStorageHandler: TravelBansStorageHandler;
  let travelStatusRetrievalHandler: TravelStatusRetrievalHandler;
  let travelStatusStore: TravelStatus[];
  let statusWriter: StatusWriter;
  const validCredentials = {
    username: Random.string('username'),
    password: Random.string('password')
  };
  const authenticator = new BasicAuthAuthenticator(validCredentials);

  beforeEach(async () => {
    travelStatusStore = [];
    statusWriter = new InMemoryTravelStatusWriter(travelStatusStore);
    travelStatusRetrievalHandler = new TravelStatusRetrievalHandler(new InMemoryTravelStatusReader(travelStatusStore));
    travelStatusStorageHandler = new TravelStatusStorageHandler(statusWriter);
    travelBansStorageHandler = new TravelBansStorageHandler(statusWriter);
    server = new Server(travelStatusRetrievalHandler, travelStatusStorageHandler, travelBansStorageHandler, authenticator, port);
    server.start();
  });

  afterEach(async () => {
    server.stop();
  });

  it('should respond 200 on health', async () => {
    const response = await httpClient(ReqOf(Method.GET,`http://localhost:${port}/health`));
    expect(response.status).to.eql(200);
  });

  describe('Storing travelStatus', () => {
    const encodedCredentials = Buffer.from(`${validCredentials.username}:${validCredentials.password}`).toString('base64');
    const travelStatus = buildTravelStatus();
    const travelBans = {'iso1' : buildTravelBan(), 'iso2' : buildTravelBan()};

    it('should store a single travelStatus', async () => {
      const response = await httpClient(ReqOf(
        Method.POST,
        `http://localhost:${port}/status`,
        JSON.stringify(travelStatus)
      ).withHeader('authorization', `Basic: ${encodedCredentials}`));
      expect(response.status).to.eql(200);
    });

    it('should not store a single travelStatus if not authed', async () => {
      const response = await httpClient(ReqOf(
        Method.POST,
        `http://localhost:${port}/status`,
        JSON.stringify(travelStatus)
      ));
      expect(response.status).to.eql(401);
    });

    it('should store all travelBans', async () => {
      const response = await httpClient(ReqOf(
        Method.POST,
        `http://localhost:${port}/travel-bans`,
        JSON.stringify(travelBans)
      ).withHeader('authorization', `Basic: ${encodedCredentials}`));
      expect(response.status).to.eql(200);
    });

    it('should not store all travelBans if not authed', async () => {
      const response = await httpClient(ReqOf(
        Method.POST,
        `http://localhost:${port}/travel-bans`,
        JSON.stringify(travelBans)
      ));
      expect(response.status).to.eql(401);
    });
  });

  describe('Retrieving travelStatus', () => {
    it('should retrieve all records (no auth required)', async () => {
      const response = await httpClient(ReqOf(
        Method.GET,
        `http://localhost:${port}/status`
      ));
      expect(response.status).to.eql(200);
    });

    it('should retrieve status for a specific country (no auth required)', async () => {
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
});
