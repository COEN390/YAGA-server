import { getBrowser, getPage } from "./setupBrowser.mjs"
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { supercScraper } from "./superCScraper.mjs";
import {insertMaxi, insertSuperC, insertMetroDB } from "../helpers/db.mjs"

const barcodeScraper = async (barcode, id) => {

    const { browser, context } = await getBrowser();

    let result = "Item with barcode " + barcode;
    let stores = [];


    const barcode12 = barcode.slice(1);
    const metroPage = await context.newPage();

    const metroResults = await metroScraper(barcode12, metroPage)

    console.log(metroResults)

    if (metroResults != null) {
        insertMetroDB(metroResults.title, metroResults.price, metroResults.img, id)
        stores.push = "metro";
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
        stores.push = "super C";
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
        stores.push = "maxi"
    }

    await maxiPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

    maxiPage.close()

    await context.clearCookies();

    await context.close();

    await browser.close();

    if (metroResults != null && superCResults != null && maxiResults != null) {
        result += " was found"
    }
    else if(metroPage != null || superCPage != null && maxiPage != null) {
        result += "was not found"
    }
    else {
        str = arr.join(', ');
        result +=  "was found at " + arr 
    }

    return result;
    

}

export { barcodeScraper }