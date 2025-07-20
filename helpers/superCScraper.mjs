// supercScraper.mjs
import { getBrowser } from './setupBrowser.mjs'; // Adjust path if needed

// Main function to scrape SuperC by barcode --> ensure barcode is 12 digits
// Returns an object with title, price, and image URL
async function supercScraper(barcode) {
    const { browser, context } = await getBrowser();
    const page = await context.newPage();

    // Navigate to SuperC's search page with the barcode
    await page.goto(`https://www.superc.ca/en/search?filter=${barcode}`, { waitUntil: 'domcontentloaded' });

    // Try to get the first product card
    const firstProduct = await page.$('div.product-tile');

    if (!firstProduct) {
        console.log("No product found on SuperC for this barcode.");
        return null;
    }

    // Extract product details
    const img = await firstProduct.$eval("img", el => el.getAttribute("src"));
    const title = await firstProduct.$eval("h3", el => el.innerText.trim());

    // Extract price (sale price if available, else regular)
    let price = null;
    try {
        price = await firstProduct.$eval("div.price__sales", el => el.innerText.trim());
    } catch {
        try {
            price = await firstProduct.$eval("div.price__regular", el => el.innerText.trim());
        } catch {
            console.log("No price found for product.");
            return null;
        }
    }

    return { title, price, img };
}

export { supercScraper };
