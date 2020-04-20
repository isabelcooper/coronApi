import {PostgresDatabase} from "./database/postgres/PostgresDatabase";
import {STORE_CONNECTION_DETAILS} from "./config/prod";
import {PostgresMigrator} from "./database/postgres/PostgresMigrator";
import {Pool} from "pg";
import {Server} from "./src/server";
import {StatusHandler} from "./src/StatusHandler";
import {SqlStatusWriter} from "./src/SqlStatusStore";

(async () => {
  await new PostgresMigrator(STORE_CONNECTION_DETAILS, './database/migrations').migrate();

  const database = new PostgresDatabase(new Pool(STORE_CONNECTION_DETAILS));
  const server = new Server(new StatusHandler(new SqlStatusWriter(database)));
  server.start();
})();
