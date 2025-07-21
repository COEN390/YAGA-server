import { getBrowser } from './setupBrowser.mjs';

async function metroScraper(barcode) {
  const { browser, context } = await getBrowser();
  const page = await context.newPage();

  const url = `https://www.metro.ca/en/online-grocery/search?filter=${barcode}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });


  // Scroll to ensure tiles are loaded
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(7000); // wait for JS rendering


  // Look for the proper tile
  const tiles = await page.$$('div.products-search--grid.searchOnlineResults div.default-product-tile');

  if (tiles.length === 0) {
    console.log("No products found for this barcode.");
    await browser.close();
    return;
  }
  
    const product = tiles[0];
    

    // product code logic to ensure right barcode, it is buggy at the moment.
    // const productCode = await product.getAttribute('data-product-code');
    // if (productCode !== barcode) {
    //   console.log("🚫 Wrong item returned.");
    //   await browser.close();
    //   return { error: "Wrong item returned" };
    // }

  const img = await product
    .$eval('img', img => img.getAttribute('src'))
    .catch(() => 'No image');

  const title = await product
    .$eval('.head__title', el => el.innerText.trim())
    .catch(() => 'No title');
    
  const price =
    (await product
      .$eval('.pricing__sale-price span.price-update', el => el.innerText.trim())
      .catch(() => null)) ||
    (await product
      .$eval('.pricing__before-price span', el => el.innerText.trim())
      .catch(() => 'No price'));

  console.log("🛒", title);
  console.log("💰", price);
  console.log("🖼️", img);
  console.log("🔗", url);
      
    await browser.close();
    return { title, price, img };
  
}

export { metroScraper };
