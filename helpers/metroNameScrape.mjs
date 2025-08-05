import { getBrowser } from './setupBrowser.mjs';

// metroNameScrape.mjs
async function metroNameScrape(searchName) {
  const { browser, context } = await getBrowser();
  const page = await context.newPage();

  const url = `https://www.metro.ca/en/online-grocery/search?filter=${searchName}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Scroll to load more results
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(2000);
  }

    // Uncomment for debugging
  // await page.screenshot({ path: `metro-debug-${searchName}.png`, fullPage: true });

  try {
    await page.waitForSelector('div.products-search--grid div.default-product-tile', { timeout: 7000 });
  } catch (err) {
    console.log("❌ No products found (waitForSelector timeout).");
    await browser.close();
    return [];
  }

  const tiles = await page.$$('div.products-search--grid div.default-product-tile');

  if (tiles.length === 0) {
    console.log("❌ No products found for this searchName.");
    await browser.close();
    return [];
  }

  const products = [];

  for (let i = 0; i < Math.min(12, tiles.length); i++) {
    const product = tiles[i];

    const barcode = await product
      .evaluate(el => el.getAttribute('data-product-code'))
      .catch(() => 'No barcode');

    const img = await product
      .$eval('picture.defaultable-picture img', img => img.getAttribute('src'))
      .catch(() => 'No image'); // If no image is found, return 'No image'

    const title = await product
      .$eval('.head__title', el => el.innerText.trim())
      .catch(() => 'No title');

    const quantity = await product
        .$eval('.head__unit-details', el => el.innerText.trim())
        .catch(() => 'No quantity');

    let pricePerUnit = await product
        .$eval('.pricing__secondary-price', el => el.innerText.trim())
        .catch(() => 'No price per unit');

        if (pricePerUnit !== "No price per unit") {
        pricePerUnit = pricePerUnit.replace(/\s*\/\s*/, "/"); // Normalize: "$0.42 /100ml" → "$0.42/100ml"
        }

    const brand = await product
        .$eval('.head__brand', el => el.innerText.trim())
        .catch(() => 'No brand');

    const price =
      (await product
        .$eval('.pricing__sale-price span.price-update', el => el.innerText.trim())
        .catch(() => null)) ||
      (await product
        .$eval('.pricing__before-price span', el => el.innerText.trim())
        .catch(() => 'No price'));

    products.push({ title, price, img, quantity, brand, pricePerUnit, barcode });
  }

  // Print the results, for testing purposes, uncomment if needed
//   console.log(`🔎 Results for: "${searchName}"`);
//   products.forEach((p, i) => {
//     console.log(`\n#${i + 1}`);
//     console.log("🛒", p.title);
//     console.log("🏷️", p.brand);
//     console.log("💰", p.price);
//     console.log("📦", p.quantity);
//     console.log("💲", p.pricePerUnit);
//     console.log("🖼️", p.img);
//   });

//   console.log("🔗", url);

  await browser.close(); // remove this if you want to keep the browser open for other scrapers, we said it maybe creates bugs though
  return products;
}

export { metroNameScrape };