// helpers/setupBrowser.mjs
import { chromium } from 'playwright';

let cachedBrowser = null;
let cachedContext = null;

async function getBrowser() {

  if (cachedBrowser && cachedContext) {
    return { browser: cachedBrowser, context: cachedContext }
  }

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  });

  cachedBrowser = browser;
  cachedContext = context;

  return { browser, context };
}

async function getPage() {
  const { context } = await getBrowser()
  return await context.newPage();
}


export { getBrowser, getPage };