import {routes, Routing} from "http4js/core/Routing";
import {Method} from "http4js/core/Methods";
import {NativeHttpServer} from "http4js/servers/NativeHttpServer";
import {ResOf} from "http4js/core/Res";
import {StatusStorageHandler} from "./StatusStorageHandler";
import {StatusRetrievalHandler} from "./StatusRetrievalHandler";

require('dotenv').config();

export class Server {
  private server: Routing;

  constructor(statusStorageHandler: StatusStorageHandler, statusRetrievalHandler: StatusRetrievalHandler, private port: number = 1010) {
    this.server = routes(Method.GET, '/health', async() => ResOf(200))
      .withPost('/status', statusStorageHandler)
      .withGet('/status', statusRetrievalHandler)
      .asServer(new NativeHttpServer(parseInt(process.env.PORT!) || this.port));
  }

  start() {
      try{
        this.server.start();
      } catch (e) {
        console.log("Error on server start:", e)
      }
      console.log(`Server running on port ${this.port}`)
  }

  stop() {
    this.server.stop();
  }
}

