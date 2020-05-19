import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/storageHandlers/TravelStatusStorageHandler";
import {StatusReader, StatusWriter} from "./src/travelStatusStore/StatusStore";
import {TravelStatusRetrievalHandler} from "./src/retrievalHandlers/TravelStatusRetrievalHandler";
import {TravelBansStorageHandler} from "./src/storageHandlers/TravelBansStorageHandler";
import {BasicAuthAuthenticator} from "./src/auth/Authenticator";
require('dotenv').config();

export async function start(statusWriter: StatusWriter, statusReader: StatusReader) : Promise<void> {
  const credentials = {
    username: process.env.USERNAME as string,
    password: process.env.PASSWORD as string,
  };
  const server = new Server(new TravelStatusRetrievalHandler(statusReader), new TravelStatusStorageHandler(statusWriter), new TravelBansStorageHandler(statusWriter), new BasicAuthAuthenticator(credentials));
  server.start();
}
