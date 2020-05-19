import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/TravelStatusStorageHandler";
import {StatusReader, StatusWriter} from "./src/StatusStore";
import {TravelStatusRetrievalHandler} from "./src/TravelStatusRetrievalHandler";
import {TravelBansStorageHandler} from "./src/TravelBansStorageHandler";

export async function start(statusWriter: StatusWriter, statusReader: StatusReader) : Promise<void> {
  const server = new Server(
    new TravelStatusRetrievalHandler(statusReader),
    new TravelStatusStorageHandler(statusWriter),
    new TravelBansStorageHandler(statusWriter)
  );
  server.start();
}
