import {InMemoryStatusReader, InMemoryStatusWriter} from "./StatusStore";
import {ReqOf} from "http4js/core/Req";
import {StatusStorageHandler} from "./StatusStorageHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {StatusRetrievalHandler} from "./StatusRetrievalHandler";
import {Dates} from "../utils/Dates";
import {buildStatus} from "../../shared/Status";

describe('StatusRetrievalHandler', () => {
  it('should retrieve all statuses', async () => {
    let status1 = buildStatus();
    let statusStore: any[] = [status1];
    const statusReader = new InMemoryStatusReader(statusStore);
    const statusHandler = new StatusRetrievalHandler(statusReader);

    const res = await statusHandler.handle(ReqOf(Method.GET, '/status'));

    expect(res.status).to.eql(200);
    //TODO:
    // expect(JSON.parse(res.bodyString())).to.eql([status1]);
    // expect(statusReader.statusStore).to.eql([status1]);
  });
});
