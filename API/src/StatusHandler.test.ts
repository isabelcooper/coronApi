import {buildStatus, InMemoryStatusWriter} from "./StatusStore";
import {ReqOf} from "http4js/core/Req";
import {StatusHandler} from "./StatusHandler";
import {Method} from "http4js/core/Methods";
import {expect} from "chai";

describe('StatusHandler', () => {
  it('should store a status', async () => {
    let statusStore: [] = [];
    const statusWriter = new InMemoryStatusWriter(statusStore);
    const statusHandler = new StatusHandler(statusWriter);

    const status = buildStatus();
    const res = await statusHandler.handle(ReqOf(Method.POST, '/status', JSON.stringify(status)));

    expect(res.status).to.eql(200);
    expect(statusWriter.statusStore).to.eql([status]);
  });
});
