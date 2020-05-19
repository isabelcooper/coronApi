import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/storageHandlers/TravelStatusStorageHandler";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter, StatusReader, StatusWriter} from "./src/travelStatusStore/StatusStore";
import {TravelStatusRetrievalHandler} from "./src/retrievalHandlers/TravelStatusRetrievalHandler";
import {TravelBansStorageHandler} from "./src/storageHandlers/TravelBansStorageHandler";

export async function start(statusWriter: StatusWriter, statusReader: StatusReader) : Promise<void> {
  const server = new Server(
    new TravelStatusRetrievalHandler(statusReader),
    new TravelStatusStorageHandler(statusWriter),
    new TravelBansStorageHandler(statusWriter)
  );
  server.start();
}
