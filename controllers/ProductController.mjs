
import { insertBarcode, insertMaxi, insertSuperC, insertMetroDB, removeBarcode , getAllMaxi, getAllSuperC, getAllMetro, getAllBarcodesDB } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { getPage } from "../helpers/setupBrowser.mjs";
import { supercScraper } from "../helpers/superCScraper.mjs";
import { metroNameScrape } from "../helpers/metroNameScrape.mjs";
import { createSearchResultsTable, clearNameSearchResults, insertNameSearchResult, getAllSearchResults } from "../helpers/searchResultsDB.mjs";

const getSearchResults = async (req, res) => {
  try {
    const results = await getAllSearchResults();
    return res.status(200).json({ products: results });
  } catch (error) {
    console.error("Failed to get search results", error);
    return res.status(500).json({ error: "Could not retrieve search results" });
  }
};

const searchByName = async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm || typeof searchTerm !== "string") {
    return res.status(400).json({ error: "Invalid search term" });
  }

  try {
    clearNameSearchResults(); // Clear old search results

    const page = await getPage();
    const results = await metroNameScrape(searchTerm, page);
    await page.close();

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    results.forEach((product) => {
      insertNameSearchResult(product, "metro", searchTerm);
    });

    return res.status(200).json({ message: "Search results inserted" });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Something went wrong during the search" });
  }
};

const getProducts = async (req, res) => {

    const maxiProducts = await getAllMaxi();
    const superCProducts = await getAllSuperC();
    const metroProducts = await getAllMetro();
    
    const mapedMaxi = maxiProducts.map( product => {
        product.store = 'maxi';
        return product;
    });
    const mapedSuperC = superCProducts.map( product => {
        product.store = 'superC';
        return product;
    });
    const mapedMetro = metroProducts.map( product => {
        product.store = 'metro';
        return product;
    });

    const allProducts = [...mapedMaxi, ...mapedSuperC, ...mapedMetro];

    const barcodes = await getAllBarcodesDB()
    
    const mappedProducts = allProducts.map(d => {
        d.barcode = barcodes.find(b => b.id === d.barcode_id).barcode
        return d
    })

    return res.status(200).json({ products: mappedProducts })
}

const addProduct = async (req, res) => {

    let { barcode } = req.body;

    let id;

    try {
        id = await insertBarcode(barcode)
    }
    catch (e) {
        return res.status(200).json({ message : 'barcode is already registered' })
    }   

    getPage().then(page => {
        metroScraper(barcode12, page).then( result => {
            console.log(result)
            if (result != null) {
                insertMetroDB(result.title, result.price, result.img, id)
            }
        }).finally( () => { page.close() } )
    })



    const barcode12 = barcode.slice(1);
    getPage().then(page => {
        supercScraper(barcode12, page).then( result => {
            console.log(result)
            if (result != null) {
                insertSuperC(result.title, result.price, result.img, id)
            }
        }).finally( () => { page.close() }  )
    })

    getPage().then(page => {
        maxiScraper(barcode, page).then( result => {
            console.log(result)
            if (result != null) {
                insertMaxi(result.title, result.price, result.img, id)
            }
        }).finally( () => { page.close() } )
    })

    

    return res.status(200).json({ message : 'barcode received'})
}

const removeProduct = async (req, res) => {
    let { barcode } = req.body
    
    removeBarcode(barcode)

    return res.status(202).json({ message: 'barcode removed'})
    
}

const getBarcodes = async (req, res) => {
    const data = await getAllBarcodesDB();

    return res.status(200).json({barcodes : data})
}


export { addProduct, getProducts, removeProduct, 
    getBarcodes, searchByName, getSearchResults }
