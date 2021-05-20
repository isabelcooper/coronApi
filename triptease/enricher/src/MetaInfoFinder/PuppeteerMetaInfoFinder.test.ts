import { Method, NativeHttpServer, ResOf, routes } from 'http4js';
import {buildCompetitor} from "./competitors";
import {PuppeteerBrowser} from "./puppeteer/PuppeteerBrowser";
import {PuppeteerMetaInfoFinder} from "./PuppeteerMetaInfoFinder";
import { render } from '@testing-library/react';
import App from "../App";
const assert = require("assert");

describe('PuppeteerMetaInfoFinder', function () {
  // this.timeout(30000);
  const competitor1 = buildCompetitor();

  const contentNoScripts = `
<html>
    <head></head>
    <body></body>
</html>
`;

  const contentWithCompetitor1 = `
<html>
    <head>
    <script src="some-script-${competitor1.matcher}here"></script>
</head>
    <body>
    <img src="/images/room-medium2.jpg"/>
    <a href="/base/no-links">Some link</a>
</body>
</html>
`;
  const contentWithCompetitor1InBody = `
<html>
    <head></head>
    <body>
        <script src="some-script-${competitor1.matcher}here"></script>
    </body>
</html>
`;

  const pages: { [key: string]: string } = {
    '/base': contentNoScripts,
    '/base/competitor1': contentWithCompetitor1,
    '/base/competitor1InBody': contentWithCompetitor1InBody,
  };

  const basicHotelWebsite = Object.keys(pages)
    .reduce(
      (router, path) => {
        return router.withGet(path, async () => ResOf(200, pages[path] as string, { 'content-type': 'text/html' }));
      },
      routes(Method.GET, '/', async () => ResOf(200)),
    )
    .asServer(new NativeHttpServer(10001));

  let browser: PuppeteerBrowser;

  beforeEach(async () => {
    browser = await PuppeteerBrowser.open(true);
    basicHotelWebsite.start();
  });

  afterEach(async () => {
    basicHotelWebsite.stop();
    await browser.close();
  });

  test('should return empty if no competitor found', async () => {
    const competitor2 = buildCompetitor();
    const metaInfoFinder = new PuppeteerMetaInfoFinder(browser, [competitor1, competitor2]);
    const siteInfo = await metaInfoFinder.findSiteInfo(`http://localhost:10001/base`);
    assert(siteInfo!.competitors).to.equal([]);
  });
  //
  // it('should find competitor name', async () => {
  //   const competitor2 = buildCompetitor();
  //   const metaInfoFinder = new PuppeteerMetaInfoFinder(browser, [competitor1, competitor2]);
  //   const siteInfo = await metaInfoFinder.findSiteInfo(`http://localhost:10001/base/competitor1`);
  //   expect(siteInfo!.competitors).to.eql([competitor1.name]);
  // });
  //
  // it('should find competitor name', async () => {
  //   const competitor2 = buildCompetitor();
  //   const metaInfoFinder = new PuppeteerMetaInfoFinder(browser, [competitor1, competitor2]);
  //   const siteInfo = await metaInfoFinder.findSiteInfo(`http://localhost:10001/base/competitor1InBody`);
  //   expect(siteInfo!.competitors).to.eql([competitor1.name]);
  // });
});
