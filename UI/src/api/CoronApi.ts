import {Status} from "../../../shared/Status";

export class CoronApi {
  constructor(private baseUrl: string = '', private fetcher = window.fetch.bind(window)) {
  }

  async getAllStatuses(): Promise<{ statuses: Status[], error?: string }> {
    try {
      const responseFromApi = await this.fetcher(`${this.baseUrl}/responses`);
      const body = await responseFromApi.text();
      const parsed = JSON.parse(body);
      return {statuses: parsed.statuses || [], error: parsed.error}
    } catch (e) {
      return {statuses: [], error: e.message}
    }
  }
}
