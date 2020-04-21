import {InMemoryStatusWriter} from "./StatusStore";
import {ReqOf} from "http4js/core/Req";
import {StatusStorageHandler} from "./StatusStorageHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";
import {buildStatus} from "../../shared/Status";

describe('StatusStorageHandler', () => {
  it('should store a status', async () => {
    let statusStore: [] = [];
    const statusWriter = new InMemoryStatusWriter(statusStore);
    const statusHandler = new StatusStorageHandler(statusWriter);

    const status = buildStatus();
    const res = await statusHandler.handle(ReqOf(Method.POST, '/status', JSON.stringify(status)));

    expect(res.status).to.eql(200);
    expect(statusWriter.statusStore).to.eql([status]);
  });
});
