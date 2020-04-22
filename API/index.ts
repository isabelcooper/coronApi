import {PostgresDatabase} from "./database/postgres/PostgresDatabase";
import {STORE_CONNECTION_DETAILS} from "./config/prod";
import {PostgresMigrator} from "./database/postgres/PostgresMigrator";
import {Pool} from "pg";
import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/TravelStatusStorageHandler";
import {SqlStatusReader, SqlTravelStatusWriter} from "./src/SqlStatusStore";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter, StatusReader, StatusWriter} from "./src/StatusStore";
import {TravelStatusRetrievalHandler} from "./src/TravelStatusRetrievalHandler";
require('dotenv').config();

(async () => {
  let statusWriter: StatusWriter;
  let statusReader: StatusReader;
  const statusStore: any[] = [];
  if (process.env.LOCAL) {
    statusWriter = new InMemoryTravelStatusWriter(statusStore);
    statusReader = new InMemoryTravelStatusReader(statusStore);
  } else {
    await new PostgresMigrator(STORE_CONNECTION_DETAILS, './database/migrations').migrate();
    const database = new PostgresDatabase(new Pool(STORE_CONNECTION_DETAILS));
    statusWriter = new SqlTravelStatusWriter(database);
    statusReader = new SqlStatusReader(database);
  }

  const server = new Server(new TravelStatusStorageHandler(statusWriter), new TravelStatusRetrievalHandler(statusReader));
  server.start();
})();
