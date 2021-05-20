import { Handler, Req, Res, ResOf } from 'http4js';
import { promises as fsPromises } from 'fs';
import { util } from 'protobufjs';
import path = util.path;

const { readFile } = fsPromises;

export class StaticFileHandler implements Handler {
  constructor(private pathRoot: string) {}

  public async handle(req: Req): Promise<Res> {
    const lastPathParam = req.uri.path().split('/').reverse()[0];
    return ResOf(200, (await readFile(path.resolve(this.pathRoot + '/', lastPathParam))).toString());
  }
}
