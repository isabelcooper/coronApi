import {expect} from "chai";
import {buildStatus, Status} from "../../../shared/Status";
import {Random} from "../../../API/utils/Random";
import {AlwaysFailCoronApiClient, CoronApiClient, InMemoryCoronApiClient} from "./CoronApi";

function buildRandomSetOfStatuses(rows? :number): Status[] {
  let i: number;
  const jsonRota = [];
  for (i = 0; i <= (rows || Random.integer(20)); i++) {
    jsonRota.push(buildStatus())
  }
  return jsonRota;
}

describe('CoronApi', () => {
  const statuses = buildRandomSetOfStatuses();
  let coronApiClient: CoronApiClient;

  it('should get all statuses', async () => {
    coronApiClient = new InMemoryCoronApiClient(statuses);

    const response = await coronApiClient.getAllStatuses();
    expect(response.success).to.eql(true);
    expect(response.payload.length).to.eql(statuses.length);
    expect(response.payload[0].country).to.eql(statuses[0].country);
    //TODO: improve dates to deep equal in formatting
    // expect(response.statuses).to.eql(statuses);
  });

  it('should store status updates for a specific country', async () => {
    coronApiClient = new InMemoryCoronApiClient();

    const status = buildStatus();
    const response = await coronApiClient.sendStatus(status);
    expect(response.success).to.eql(true);
    expect(coronApiClient.storedStatuses).to.eql([status]);
  });

  it('should return errors from the api', async () => {
    const apiClient = new AlwaysFailCoronApiClient();
    const response = await apiClient.getAllStatuses();
    expect(response).to.eql({ payload: "", success: false, message: 'error'});
  });
});
