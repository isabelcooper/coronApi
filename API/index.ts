import {PostgresDatabase} from "./database/postgres/PostgresDatabase";
import {STORE_CONNECTION_DETAILS} from "./config/prod";
import {PostgresMigrator} from "./database/postgres/PostgresMigrator";
import {Pool} from "pg";
import {Server} from "./src/server";
import {StatusStorageHandler} from "./src/StatusStorageHandler";
import {SqlStatusReader, SqlStatusWriter} from "./src/SqlStatusStore";
import {InMemoryStatusReader, InMemoryStatusWriter, StatusReader, StatusWriter} from "./src/StatusStore";
import {StatusRetrievalHandler} from "./src/StatusRetrievalHandler";
require('dotenv').config();

(async () => {
  let statusWriter: StatusWriter;
  let statusReader: StatusReader;
  const statusStore: any[] = [];
  if (process.env.LOCAL) {
    statusWriter = new InMemoryStatusWriter(statusStore);
    statusReader = new InMemoryStatusReader(statusStore);
  } else {
    await new PostgresMigrator(STORE_CONNECTION_DETAILS, './database/migrations').migrate();
    const database = new PostgresDatabase(new Pool(STORE_CONNECTION_DETAILS));
    statusWriter = new SqlStatusWriter(database);
    statusReader = new SqlStatusReader(database);
  }

  const server = new Server(new StatusStorageHandler(statusWriter), new StatusRetrievalHandler(statusReader));
  server.start();
})();
