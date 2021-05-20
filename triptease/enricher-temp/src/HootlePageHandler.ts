import { Handler } from 'http4js';
import { Req } from 'http4js/core/Req';
import { Res, ResOf } from 'http4js/core/Res';
import { renderJSX } from '../../onboarding/AdvertContentPageHandler';
import { HootlePage, HootlePageProps } from './HootlePage';
import { MetaInfoFinder } from './PuppeteerMetaInfoFinder';

export class HootlePageHandler implements Handler {
  constructor(
    private metaInfoFinder: MetaInfoFinder,
    private renderFn: (params: HootlePageProps) => string = (params: HootlePageProps) =>
      renderJSX(new HootlePage(params)),
  ) {}

  public async handle(req: Req): Promise<Res> {
    const search = req.bodyForm().search as string;
    const url = req.bodyForm().url as string;
    const metaInfo = search ? await this.metaInfoFinder.findMetaInfo(search) : undefined;
    const siteInfo = url ? await this.metaInfoFinder.findSiteInfo(url) : undefined;
    return ResOf(200, this.renderFn({ search, url, metaInfo, siteInfo }), {
      'Content-Type': 'text/html;charset=utf-8',
      'Cache-Control': 'no-cache',
    });
  }
}
