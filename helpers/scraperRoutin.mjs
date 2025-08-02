import { getPage } from "./setupBrowser.mjs"
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { supercScraper } from "./superCScraper.mjs";

import {insertMaxi, insertSuperC, insertMetroDB } from "../helpers/db.mjs"

const barcodeScraper = async (barcode, id) => {

    const barcode12 = barcode.slice(1);

    const metroPage = await getPage()

    const metroResults = await metroScraper(barcode12, metroPage)

    console.log(metroResults)

    if (metroResults != null) {
        insertMetroDB(metroResults.title, metroResults.price, metroResults.img, id)
    }

    metroPage.close()

    const superCPage = await getPage()

    const superCResults = await supercScraper(barcode12, superCPage)

    console.log(superCResults)

    if (superCResults != null) {
        insertSuperC(superCResults.title, superCResults.price, superCResults.img, id)
    }

    superCPage.close()

    const maxiPage = await getPage()

    const maxiResults = await maxiScraper(barcode, maxiPage)

    console.log(maxiResults)

    if (maxiResults != null) {
        insertMaxi(maxiResults.title, maxiResults.price, maxiResults.img, id)
    }

    maxiPage.close()

}

export { barcodeScraper }