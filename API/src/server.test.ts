import {HttpClient} from "http4js/client/HttpClient";
import {Server} from "./server";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {buildStatus, InMemoryStatusWriter} from "./StatusStore";
import {StatusHandler} from "./StatusHandler";
import {SqlStatusWriter} from "./SqlStatusStore";

describe('Server', () => {
  const httpClient = HttpClient;
  const port = 1111;
  let server: Server;
  let statusHandler: StatusHandler;
  let statusStore: [];

  beforeEach(async () => {
    statusStore = [];
    statusHandler = new StatusHandler(new InMemoryStatusWriter(statusStore));
    server = new Server(statusHandler, port);
    server.start();
  });

  afterEach(async () => {
    server.stop();
  });

  it('should respond 200 on health', async () => {
    const response = await httpClient(ReqOf(Method.GET,`http://localhost:${port}/health`));
    expect(response.status).to.eql(200);
  });

  it('allow a record to be stored', async () => {
    const status = buildStatus();

    const response = await httpClient(ReqOf(
      Method.POST,
      `http://localhost:${port}/status`,
      JSON.stringify(status)
    ));
    expect(response.status).to.eql(200);
  });
});
