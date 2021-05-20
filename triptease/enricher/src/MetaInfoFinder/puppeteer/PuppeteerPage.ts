import { EvaluateFn, Page, WaitForSelectorOptions } from 'puppeteer';
import { PuppeteerImage } from './PuppeteerImage';

function evaluateWithoutErrors(page: Page): (fn: EvaluateFn, ...args: any[]) => Promise<any> {
  return (fn: EvaluateFn, ...args: any[]) =>
    page.evaluate(fn, ...args).catch(() => {
      /* ignore */
    });
}

function waitForSelectorWithoutErrors(
  page: Page,
): (selector: string, options?: WaitForSelectorOptions) => Promise<any> {
  return (selector: string, options?: WaitForSelectorOptions) =>
    page.waitForSelector(selector, options).catch(() => {
      /* ignore */
    });
}

export class PuppeteerPage {
  constructor(private page: Page) {}

  public async reload() {
    await this.page.reload();
  }

  async selectorPresent(selector: string): Promise<boolean> {
    await waitForSelectorWithoutErrors(this.page)(selector);
    return await evaluateWithoutErrors(this.page)((selector) => !!document.querySelector(selector), selector);
  }

  public async text(selector: string): Promise<string> {
    await waitForSelectorWithoutErrors(this.page)(selector, { visible: true, timeout: 5000 });
    return await evaluateWithoutErrors(this.page)((selector) => {
      const element = document.querySelector(selector);
      return element && element.textContent.trim();
    }, selector);
  }

  public async value(selector: string): Promise<string> {
    await waitForSelectorWithoutErrors(this.page)(selector, { visible: true, timeout: 5000 });
    return await evaluateWithoutErrors(this.page)((selector) => {
      const element = document.querySelector(selector);
      return element && element.value.trim();
    }, selector);
  }

  async saveScreenshot(imageFilename: string) {
    try {
      await this.page.screenshot({
        fullPage: true,
        path: imageFilename,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async close() {
    await this.page.close();
  }

  public async images(minHeight: number = 500, minWidth: number = 500): Promise<PuppeteerImage[]> {
    const imageLinks = await this.page.evaluate(
      (minHeight, minWidth) =>
        Array.from(document.images)
          .filter((img) => img.naturalHeight > minHeight && img.naturalWidth > minWidth)
          .map((img) => ({
            url: img.currentSrc,
            width: img.naturalWidth,
            height: img.naturalHeight,
          })),
      minHeight,
      minWidth,
    );
    return Array.from(new Set(imageLinks));
  }

  public async links() {
    const links = await this.page.evaluate(() => Array.from(document.links).map((a) => a.href));
    return Array.from(new Set(links)) as string[];
  }

  public async goto(url: URL) {
    await this.page.goto(url.toString());
    // await this.page.waitForNavigation();
    return new PuppeteerPage(this.page);
  }

  async click(selector: string) {
    await waitForSelectorWithoutErrors(this.page)(selector, { visible: true, timeout: 5000 });
    return await evaluateWithoutErrors(this.page)((selector) => {
      const element = document.querySelector(selector);
      return element && element.click();
    }, selector);
  }

  async waitForNavigation(time: any) {
    await this.page.waitForNavigation(time);
  }

  async contains(text: string) {
    return await evaluateWithoutErrors(this.page)(() => {
      return document && document.body && document.body.textContent && document.body.textContent.includes(text);
    });
  }

  async scripts(): Promise<string[]> {
    return await this.page.evaluate(() => Array.from(document.scripts).map((script) => script.src));
  }

  async bodyScriptText(): Promise<string[]> {
    return await this.page.evaluate(() =>
      Array.from(document.getElementsByTagName('script')).map((script) => script.text),
    );
  }
}
