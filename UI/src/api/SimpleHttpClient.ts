import {Res} from 'http4js/core/Res';
import {Req} from 'http4js/core/Req';
import {HttpClient, HttpsClient} from 'http4js';

export class SimpleHttpClient {
  async handle(req: Req): Promise<Res> {
    const httpFn = req.uri.protocol() === 'https' ? HttpsClient : HttpClient;
    return httpFn(req);
  }
}