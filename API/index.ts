import {Server} from "./src/server";
import {TravelStatusStorageHandler} from "./src/storageHandlers/TravelStatusStorageHandler";
import {InMemoryTravelStatusReader, InMemoryTravelStatusWriter, StatusReader, StatusWriter} from './src/travelStatusStore/StatusStore';
import {TravelStatusRetrievalHandler} from "./src/retrievalHandlers/TravelStatusRetrievalHandler";
import {TravelBansStorageHandler} from "./src/storageHandlers/TravelBansStorageHandler";
import {BasicAuthAuthenticator, BasicAuthCredentials} from "./src/auth/Authenticator";
import {SqlStatusReader, SqlTravelStatusWriter} from './src/travelStatusStore/SqlStatusStore';

const start = async (statusWriter: StatusWriter, statusReader: StatusReader, credentials: BasicAuthCredentials) : Promise<void> => {
  const server = new Server(
    new TravelStatusRetrievalHandler(statusReader),
    new TravelStatusStorageHandler(statusWriter),
    new TravelBansStorageHandler(statusWriter),
    new BasicAuthAuthenticator(credentials)
  );
  server.start();
}

export {
  BasicAuthCredentials,
  StatusReader,
  StatusWriter,
  SqlStatusReader,
  SqlTravelStatusWriter,
  InMemoryTravelStatusReader,
  InMemoryTravelStatusWriter,
  start
};
