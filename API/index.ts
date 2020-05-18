import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/TravelStatusStorageHandler";
import {StatusReader, StatusWriter} from "./src/StatusStore";
import {TravelStatusRetrievalHandler} from "./src/TravelStatusRetrievalHandler";

export async function start(statusWriter: StatusWriter, statusReader: StatusReader) : Promise<void> {
  const server = new Server(new TravelStatusStorageHandler(statusWriter), new TravelStatusRetrievalHandler(statusReader));
  server.start();
}
