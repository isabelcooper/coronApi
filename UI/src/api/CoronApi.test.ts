import {expect} from "chai";
import {CoronApi} from "./CoronApi";
import {buildStatus, Status} from "../../../shared/Status";
import {Random} from "../../../API/utils/Random";

function buildRandomSetOfStatuses(rows? :number): Status[] {
  let i: number;
  const jsonRota = [];
  for (i = 0; i <= (rows || Random.integer(20)); i++) {
    jsonRota.push(buildStatus())
  }
  return jsonRota;
}

describe('CoronApi', () => {
  it('gets transformed data', async () => {
    const statuses = buildRandomSetOfStatuses();

    const workingFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      async function getText() {
        return JSON.stringify({statuses});
      }
      return {status: 200, text: getText} as Response;
    };
    const coronApi = new CoronApi('', workingFetch);
    const response = await coronApi.getAllStatuses();
    expect(response.statuses.length).to.eql(statuses.length);
    expect(response.statuses[0].country).to.eql(statuses[0].country);
    expect(response.statuses[0].flightStatus).to.eql(statuses[0].flightStatus);
    //TODO: improve dates to deep equal in formatting
    // expect(response.statuses).to.eql(statuses);
  });

  it('returns errors from the api', async () => {
    const errorFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      async function getText() {
        return JSON.stringify({error: 'error getting data from db'});
      }
      return { status: 500, text: getText } as Response;
    };
    const rotaApi = new CoronApi('', errorFetch);
    const rota = await rotaApi.getAllStatuses();
    expect(rota).to.eql({statuses: [], error: 'error getting data from db'})
  });

  it('handles fetch errors', async() => {
    const failedFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      throw new Error('failed to fetch')
    };
    const surveyApi = new CoronApi('', failedFetch);
    const rotaRows = await surveyApi.getAllStatuses();
    expect(rotaRows).to.eql({statuses: [], error: 'failed to fetch'})
  });

});
