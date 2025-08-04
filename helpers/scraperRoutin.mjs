import { getBrowser, getPage } from "./setupBrowser.mjs"
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { supercScraper } from "./superCScraper.mjs";
import { chromium } from "playwright";
import {insertMaxi, insertSuperC, insertMetroDB } from "../helpers/db.mjs"

const barcodeScraper = async (barcode, id) => {

    const { browser, context } = await getBrowser();

    let result = {
        barcode : barcode
    }
    const barcode12 = barcode.slice(1);

    const metroPage = await context.newPage();

    const metroResults = await metroScraper(barcode12, metroPage)

    console.log(metroResults)

    if (metroResults != null) {
        insertMetroDB(metroResults.title, metroResults.price, metroResults.img, id)
        result.metro = metroResults
    }

    await metroPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

    metroPage.close()

    const superCPage = await context.newPage();

    const superCResults = await supercScraper(barcode12, superCPage)

    console.log(superCResults)

    if (superCResults != null) {
        insertSuperC(superCResults.title, superCResults.price, superCResults.img, id)
        result.super_C = superCResults
    }

    await superCPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

    superCPage.close()

    const maxiPage = await context.newPage();

    const maxiResults = await maxiScraper(barcode, maxiPage)

    console.log(maxiResults)

    if (maxiResults != null) {
        insertMaxi(maxiResults.title, maxiResults.price, maxiResults.img, id)
        result.maxi = maxiResults
    }

    await maxiPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

    maxiPage.close()

    await context.clearCookies();

    await context.close();

    await browser.close();

    return JSON.stringify(result);
    

}

export { barcodeScraper }