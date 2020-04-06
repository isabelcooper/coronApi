import {PostgresDatabase} from "./database/postgres/PostgresDatabase";
import {Pool} from "pg";
import {EVENT_STORE_CONNECTION_DETAILS} from "./config/prod";
import {PostgresMigrator} from "./database/postgres/PostgresMigrator";

(async () => {
  await new PostgresMigrator(EVENT_STORE_CONNECTION_DETAILS, './database/migrations').migrate();

  const database = new PostgresDatabase(new Pool(EVENT_STORE_CONNECTION_DETAILS));
  const server = new Server();
  server.start();
})();
