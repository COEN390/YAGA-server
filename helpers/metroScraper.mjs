
async function metroScraper(barcode, page) {

  const url = `https://www.metro.ca/en/online-grocery/search?filter=${barcode}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Scroll multiple times to trigger lazy loading
  try {

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(2000); // 2s between scrolls
    }

    // Next line is for debugging purposes, uncomment to take a screenshot
    // await page.screenshot({ path: `metro-debug-${barcode}.png`, fullPage: true });
    // Wait explicitly for the product tile to appear
    await page.waitForSelector('div.products-search--grid div.default-product-tile', { timeout: 20000 });
    
  } catch (err) {
    console.log("❌ No products found (waitForSelector timeout).");
    return;
  }

  const tiles = await page.$$('div.products-search--grid div.default-product-tile');
  if (tiles.length === 0) {
    console.log("❌ No products found for this barcode.");
    return;
  }

  const product = tiles[0];

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

  return { title, price, img };
}

export { metroScraper };
