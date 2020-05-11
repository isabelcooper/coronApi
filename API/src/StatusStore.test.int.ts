import {expect} from "chai";
import {PostgresTestServer} from "../database/postgres/PostgresTestServer";
import {PostgresDatabase} from "../database/postgres/PostgresDatabase";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter, StatusReader, StatusWriter} from "./StatusStore";
import {SqlStatusReader, SqlTravelStatusWriter} from "./SqlStatusStore";
import {buildTravelStatus, TravelStatus} from "../../shared/TravelStatus";
import {Dates} from "../utils/Dates";

describe('SqlStatusStore', function () {
  this.timeout(30000);
  const testPostgresServer = new PostgresTestServer();

  let database: PostgresDatabase;

  before(async () => {
    database = await testPostgresServer.startAndGetCoronapiDatabase();
  });


  after(async () => {
    await testPostgresServer.stop();
  });

  const statusStoreContract = (statusStoreFn: () => [StatusReader, StatusWriter], cleanupFn: () => Promise<void>) => () => {
    let statusReader: StatusReader;
    let statusWriter: StatusWriter;

    beforeEach(async () => {
      [statusReader, statusWriter] = statusStoreFn();
      await cleanupFn();
    });

    it('should store and read all statuses', async () => {
      const status1 = buildTravelStatus();
      const status2 = buildTravelStatus();
      await statusWriter.store(status1);
      await statusWriter.store(status2);
      //TODO: amend mapper to convert stored timestamp back to date
      expect(await statusReader.readAll()).to.deep.include.members([status1, status2]);
    });
    it('should only read the most recent status', async () => {
      const status1 = buildTravelStatus();
      const status2 = buildTravelStatus({country: status1.country, updated: Dates.addDays(status1.updated, 1)});
      await statusWriter.store(status1);
      await statusWriter.store(status2);
      expect(await statusReader.readAll()).to.deep.equal([ status2]);
    });
  };

  describe('StatusStore', statusStoreContract(
    () => [new SqlStatusReader(database), new SqlTravelStatusWriter(database)],
    async () => {
      await database.inTransaction(async client => {
        await client.query('TRUNCATE TABLE travel_status;');
      })
    }));

  describe('InMemoryStatusStore', statusStoreContract(
    () => {
      const store: TravelStatus[] = [];
      return [new InMemoryTravelStatusReader(store), new InMemoryTravelStatusWriter(store)]
    },
    async () => {})
  );
});
