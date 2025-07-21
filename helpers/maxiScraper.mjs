

async function maxiScraper(barcode, page) {

    await page.goto(`https://www.maxi.ca/en/search?search-bar=${barcode}`);

    await page.waitForSelector("[data-testid='product-image']");

    const headerText = await page.textContent("[data-testid='heading']");
    if (headerText === `We were unable to find results for "${barcode}"`) {
        console.log("Product not found");
        return null;
    }

    const products = await page.$$(".css-yyn1h");

    for (const product of products) {
        const img = await product.$eval("img", el => el.getAttribute("src"));
        const title = await product.$eval("[data-testid='product-title']", el => el.innerText);

        let price = null;
        try {
            price = await product.$eval("[data-testid='regular-price']", el => el.innerText);
        } catch (e) {
            try {
                price = await product.$eval("[data-testid='sale-price']", el => el.innerText);
            } catch (e) { // it was fucked
                return null;
            }
        }

        return { title, price, img }

  }

}

export { maxiScraper }