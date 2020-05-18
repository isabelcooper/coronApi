import {expect} from "chai";
import {buildTravelStatus, TravelStatus} from "../../../API/src/TravelStatus";
import {Random} from "../../../API/utils/Random";
import {AlwaysFailCoronApiClient, CoronApiClient, InMemoryCoronApiClient} from "./CoronApi";
import {CoronApiHttpClient} from "./CoronApiHttpClient";
import {Server} from "../../../API/src/server";
import {TravelStatusStorageHandler} from "../../../API/src/TravelStatusStorageHandler";
import {TravelStatusRetrievalHandler} from "../../../API/src/TravelStatusRetrievalHandler";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter} from "../../../API/src/StatusStore";

function buildRandomSetOfStatuses(rows?: number): TravelStatus[] {
  let i: number;
  const jsonRota = [];
  for (i = 0; i <= (rows || Random.integer(20)); i++) {
    jsonRota.push(buildTravelStatus())
  }
  return jsonRota;
}

describe('CoronApi', () => {
  const store: TravelStatus[] = [];
  const server = new Server(new TravelStatusStorageHandler(new InMemoryTravelStatusWriter(store)), new TravelStatusRetrievalHandler(new InMemoryTravelStatusReader(store)));

  before( () => {
    server.start()
  });

  after( () => {
    server.start()
  });


  const coronApiContract = (coronApiFn: () => CoronApiClient, cleanupFn: () => Promise<void>) => () => {
    const coronApiClient = coronApiFn();
    let statuses: TravelStatus[];

    beforeEach(async () => {
      statuses = buildRandomSetOfStatuses();
      await cleanupFn();
    });

    it('should store and get all statuses', async () => {
      await Promise.all(statuses.map(async(status) => {
        const response = await coronApiClient.sendStatus(status);
        expect(response.success).to.eql(true);
      }));

      const response = await coronApiClient.getAllStatuses();
      expect(response.success).to.eql(true);

      const payload = JSON.parse(response.payload);
      expect(payload.length).to.eql(statuses.length);
      expect(payload[0].country).to.eql(statuses[0].country);
    });
  };

  const inMemoryCoronApiClient = new InMemoryCoronApiClient();
  const coronApiHttpClient = new CoronApiHttpClient('http://localhost:1010');

  describe('InMemoryCoronApiClient', coronApiContract(
    () => inMemoryCoronApiClient,
    async () => {
      inMemoryCoronApiClient.storedStatuses = []
    }
  ));

  describe('HttpCoronApiClient', coronApiContract(
    () => coronApiHttpClient,
    async () => {}
  ));

  describe('Handling failure', () => {
    it('should return errors from the api', async () => {
      const apiClient = new AlwaysFailCoronApiClient();
      const response = await apiClient.getAllStatuses();
      expect(response).to.eql({payload: "", success: false, message: 'error'});
    });
  })

});
