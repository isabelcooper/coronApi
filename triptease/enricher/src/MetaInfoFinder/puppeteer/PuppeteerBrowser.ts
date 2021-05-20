import { Browser, Page } from 'puppeteer';
import { PuppeteerPage } from './PuppeteerPage';

const puppeteerExtra = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(stealthPlugin());

export class PuppeteerBrowser {
  constructor(private browser: Browser, private proxyUrl?: URL) {}

  public static async open(headless: boolean, proxyUrl?: URL) {
    const browser: Browser = await puppeteerExtra.launch({
      headless: headless,
      args: [
        `--window-size=1280,1080`,
        '--no-sandbox',
        '--incognito',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        proxyUrl ? `--proxy-server=${proxyUrl.host}` : '',
      ],
    });

    browser.on('disconnected', async () => PuppeteerBrowser.open(headless, proxyUrl));

    return new PuppeteerBrowser(browser, proxyUrl);
  }

  public async newPage(url: URL, width: number, height: number, loadImages: boolean = true) {
    const page = await maskPuppeteer(await this.browser.newPage());
    await page.setRequestInterception(!loadImages);
    if (!loadImages) {
      page.on('request', (request) => {
        if (!loadImages && ['image'].indexOf(request.resourceType()) !== -1) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }
    if (this.proxyUrl) {
      await page.authenticate({
        username: this.proxyUrl.username,
        password: this.proxyUrl.password,
      });
    }
    await page.setViewport({
      width,
      height,
    });
    return new PuppeteerPage(page).goto(url);
  }

  async close() {
    await this.browser.close();
  }
}

async function maskPuppeteer(page: Page) {
  await maskUserAgent(page);
  await maskWebDriver(page);
  await maskChrome(page);
  await maskPermissions(page);
  await maskPlugins(page);
  await maskLanguages(page);
  return page;
}

async function maskUserAgent(page: Page) {
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36',
  );
}

async function maskWebDriver(page: Page) {
  await page.evaluateOnNewDocument(() =>
    Object.defineProperty(window.navigator as any, 'webdriver', { get: () => false }),
  );
}

async function maskChrome(page: Page) {
  await page.evaluateOnNewDocument(() => ((window.navigator as any).chrome = { runtime: {} }));
}

async function maskPermissions(page: Page) {
  await page.evaluateOnNewDocument(() => {
    const originalQuery = (window.navigator as any).permissions.query;
    return ((window.navigator as any).permissions.query = (parameters: any) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: (Notification as any).permission })
        : originalQuery(parameters));
  });
}

async function maskPlugins(page: Page) {
  await page.evaluateOnNewDocument(() =>
    Object.defineProperty(window.navigator as any, 'plugins', {
      get: () => ({ '0': { '0': {} }, '1': { '0': {} }, '2': { '0': {}, '1': {} } }),
    }),
  );
}

async function maskLanguages(page: Page) {
  await page.evaluateOnNewDocument(() =>
    Object.defineProperty(window.navigator as any, 'languages', {
      get: () => ['en-US', 'en'],
    }),
  );
}
