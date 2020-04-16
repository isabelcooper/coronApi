//
// export class CoronApi {
//   constructor(private baseUrl: string = '', private fetcher = window.fetch.bind(window)) {}
//
//   async getResponses(): Promise<{ responses: GroupedResponses, error?: string }> {
//     try {
//       const responseFromApi = await this.fetcher(`${this.baseUrl}/responses`);
//       const body = await responseFromApi.text();
//       const parsed = JSON.parse(body);
//       return {responses: parsed.responses || [], error: parsed.error}
//     } catch(e) {
//       return {responses: {}, error: e.message}
//     }
//   }
//
//   async saveResponse(surveyResponse: SurveyResponse): Promise<{error?: string, responses: GroupedResponses}> {
//     try {
//       const responseFromApi = await this.fetcher(`${this.baseUrl}/responses`, {method: 'POST', body: JSON.stringify(surveyResponse)});
//       const body = await responseFromApi.text();
//       const parsed = JSON.parse(body);
//       if(responseFromApi.status === 200) {
//         return {responses: parsed.responses}
//       }
//       return {responses: {}, error: `non 200 status code returned: ${responseFromApi.status}`}
//     } catch(e) {
//       return {responses: {}, error: e.message}
//     }
//   }
//
//   async getQuestion(): Promise<{question: Question, error?: string}> {
//     try {
//       const responseFromApi = await this.fetcher(`${this.baseUrl}/questions`);
//       const body = await responseFromApi.text();
//       const parsed = JSON.parse(body);
//       if(parsed.error) {
//         return {question: {} as Question, error: parsed.error}
//       }
//       return {question: parsed.question}
//     } catch(e) {
//       return {question: {} as Question, error: e.message}
//     }
//
//   }
// }
