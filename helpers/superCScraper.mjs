
// Main async function to scrape one product from Super C using the barcode
async function supercScraper(barcode, page) {
  // Launch a Chromium browser instance (headless mode true for production, false for debugging)

  // Construct the Super C search URL with the given barcode
  const url = `https://www.superc.ca/en/search?filter=${barcode}`;

  let product
 
  // Navigate to the URL and wait until the network is idle (no more loading)
    try{

    await page.goto(url);

    // Wait for at least one product tile to appear in the results
    await page.waitForSelector('div.default-product-tile');

    // Select the first product tile on the page
    product = await page.$('div.default-product-tile');
  }
  catch(e) {
    console.log("superC got timed out");
    return null
  }

  // If no product is found (unexpected barcode or network issue), exit early
  if (!product) {
    console.log("❌ No product found for this barcode.");
    return;
  }

  // Extract the image source as a url
  const img = await product
    .$eval('picture.defaultable-picture img', img => img.getAttribute('src'))
    .catch(() => 'No image'); // If no image is found, return 'No image'

  // Extract the product title text
  const title = await product
    .$eval('.head__title', el => el.innerText.trim())
    .catch(() => 'No title'); // If no title is found, return 'No title' --> not a good sign, should maybe exit early if no title.

  // Try to extract sale price first
  // If sale price is missing, fall back to regular price
  // If both are missing, return "No price" --> Should never happen, but just in case
  const price =
    (await product
      .$eval('.pricing__sale-price', el => el.innerText.trim())
      .catch(() => null)) || // Try sale price, fallback to null
    (await product
      .$eval('.pricing__regular-price', el => el.innerText.trim())
      .catch(() => 'No price')); // If sale price fails, try regular price

  // Print the result nicely for testing
  console.log("🛒", title);
  console.log("💰", price);
  console.log("🖼️", img);
  console.log("🔗", url);

  
  return {title, price, img};
}

export { supercScraper };