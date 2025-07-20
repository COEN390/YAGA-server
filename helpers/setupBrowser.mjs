// setupBrowser.mjs
import { chromium } from 'playwright';

let cachedBrowser = null;
let cachedContext = null;

export async function getBrowser() {
    if (cachedBrowser && cachedContext) {
        return { browser: cachedBrowser, context: cachedContext };
    }

    cachedBrowser = await chromium.launch({ headless: true });
    cachedContext = await cachedBrowser.newContext();
    return { browser: cachedBrowser, context: cachedContext };
}
