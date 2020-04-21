import {HttpClient} from "http4js/client/HttpClient";
import {Server} from "./server";
import {ReqOf} from "http4js/core/Req";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {InMemoryStatusReader, InMemoryStatusWriter} from "./StatusStore";
import {StatusStorageHandler} from "./StatusStorageHandler";
import {SqlStatusWriter} from "./SqlStatusStore";
import {Status} from "http4js/core/Status";
import {StatusRetrievalHandler} from "./StatusRetrievalHandler";
import {buildStatus} from "../../shared/Status";

describe('Server', () => {
  const httpClient = HttpClient;
  const port = 1111;
  let server: Server;
  let statusStorageHandler: StatusStorageHandler;
  let statusRetrievalHandler: StatusRetrievalHandler;
  let statusStore: [];

  beforeEach(async () => {
    statusStore = [];
    statusStorageHandler = new StatusStorageHandler(new InMemoryStatusWriter(statusStore));
    statusRetrievalHandler = new StatusRetrievalHandler(new InMemoryStatusReader(statusStore));
    server = new Server(statusStorageHandler, statusRetrievalHandler, port);
    server.start();
  });

  afterEach(async () => {
    server.stop();
  });

  it('should respond 200 on health', async () => {
    const response = await httpClient(ReqOf(Method.GET,`http://localhost:${port}/health`));
    expect(response.status).to.eql(200);
  });

  it('should allow a record to be stored', async () => {
    const status = buildStatus();

    const response = await httpClient(ReqOf(
      Method.POST,
      `http://localhost:${port}/status`,
      JSON.stringify(status)
    ));
    expect(response.status).to.eql(200);
  });
  it('should retrieve all records', async () => {
    const response = await httpClient(ReqOf(
      Method.GET,
      `http://localhost:${port}/status`
    ));
    expect(response.status).to.eql(200);
  });
});
