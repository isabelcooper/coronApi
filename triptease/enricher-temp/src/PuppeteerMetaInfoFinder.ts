import { PuppeteerBrowser } from '../../../../shared/src/puppeteer/PuppeteerBrowser';
import { defaultLogger, Logger } from '../../../../shared/src/log/Logger';
import { PuppeteerPage } from '../../../../shared/src/puppeteer/PuppeteerPage';
import { Competitor } from '../static/competitors';

export interface HotelMetaInfo {
  name: string;
  address: string;
  country: string;
  roomCount?: number;
  rating: number;
}

export interface HotelSiteInfo {
  competitors: (string | undefined)[];
}

export interface MetaInfoFinder {
  findMetaInfo(hotelName: string): Promise<HotelMetaInfo | undefined>;

  findSiteInfo(url: string): Promise<HotelSiteInfo | undefined>;
}

export class InMemoryMetaInfoFinder implements MetaInfoFinder {
  constructor(
    private metaInfos: { [hotelName: string]: HotelMetaInfo } = {},
    private siteInfos: { [url: string]: HotelSiteInfo } = {},
  ) {}

  public async findMetaInfo(hotelName: string): Promise<HotelMetaInfo | undefined> {
    return this.metaInfos[hotelName];
  }

  public async findSiteInfo(url: string): Promise<HotelSiteInfo | undefined> {
    return this.siteInfos[url];
  }
}

export class PuppeteerMetaInfoFinder implements MetaInfoFinder {
  constructor(
    private browser: PuppeteerBrowser,
    private competitors: Competitor[],
    private _logger: Logger = defaultLogger,
  ) {}

  public async findMetaInfo(hotelName: string): Promise<HotelMetaInfo | undefined> {
    try {
      let page = await this.browser.newPage(
        new URL(`https://duckduckgo.com/?q=tripadvisor.com+${hotelName}&t=h_&ia=web`),
        1280,
        1024,
      );
      await page.click('div[data-domain="www.tripadvisor.com"] a');
      const jsonMetaData = JSON.parse(await page.text('script[type="application/ld+json"]'));
      const address = jsonMetaData.address;
      const aboutContent = await page.text('div[data-placement-name="about_addendum_react"]');
      const roomCount = aboutContent ? parseInt(aboutContent.split('NUMBER OF ROOMS')[1]) : undefined;
      await page.close();
      return {
        name: jsonMetaData.name,
        address: `${[
          address.streetAddress,
          address.addressLocality,
          address.addressRegion,
          address.postalCode,
          address.addressCountry.name,
        ].join(', ')}`,
        country: address.addressCountry.name,
        roomCount,
        rating: jsonMetaData.aggregateRating.ratingValue,
      };
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  public async findSiteInfo(url: string): Promise<HotelSiteInfo | undefined> {
    try {
      let page = await this.browser.newPage(new URL(url), 1280, 1024);

      const foundCompetitors = await this.detectCompetitors(page);
      await page.close();
      return {
        competitors: foundCompetitors,
      };
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  private async detectCompetitors(page: PuppeteerPage): Promise<(string | undefined)[]> {
    const scriptsFromHead = await page.scripts();
    const scriptsFromBody = await page.bodyScriptText();

    const filteredCompetitors = this.competitors.filter((competitor) => {
      return [...scriptsFromHead, ...scriptsFromBody].some((script) => script.includes(competitor.matcher));
    });
    return filteredCompetitors.map((competitor) => competitor.name);
  }
}
