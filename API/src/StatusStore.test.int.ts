import {expect} from "chai";
import {PostgresTestServer} from "../database/postgres/PostgresTestServer";
import {PostgresDatabase} from "../database/postgres/PostgresDatabase";
import {
  buildStatus,
  InMemoryStatusReader,
  InMemoryStatusWriter,
  Status,
  StatusReader,
  StatusWriter
} from "./StatusStore";
import {SqlStatusReader, SqlStatusWriter} from "./SqlStatusStore";

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
      const status1 = buildStatus();
      const status2 = buildStatus();
      await statusWriter.store(status1);
      await statusWriter.store(status2);
      //TODO: amend mapper to convert stored timestamp back to date
      expect(await statusReader.readAll()).to.deep.equal([status1, status2]);
      expect((await statusReader.readAll())[0].updated).to.eql(new Date(status1.updated));
    });
  };

  describe('StatusStore', statusStoreContract(
    () => [new SqlStatusReader(database), new SqlStatusWriter(database)],
    async () => {
      await database.inTransaction(async client => {
        await client.query('TRUNCATE TABLE status;');
      })
    }));
  describe('InMemoryStatusStore', statusStoreContract(
    () => {
      const store: Status[] = [];
      return [new InMemoryStatusReader(store), new InMemoryStatusWriter(store)]
    },
    async () => {})
  );
});
