
import { insertBarcode, insertMaxi, insertSuperC, removeBarcode , getAllMaxi, getAllSuperC, getAllMetro, getAllBarcodesDB } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { getPage } from "../helpers/setupBrowser.mjs";
import { supercScraper } from "../helpers/superCScraper.mjs";

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

    return res.status(200).json({ products: allProducts })
}

const addProduct = async (req, res) => {

    // Todo!!!
    // need to make sure it is not fucked
    let { barcode } = req.body;

    let id;

    try {
        id = await insertBarcode(barcode)
    }
    catch (e) {
        return res.status(200).json({ message : 'barcode is already registered' })
    }   

    getPage().then(page => {
        maxiScraper(barcode, page).then( result => {
            console.log(result)
            if (result != null) {
                insertMaxi(result.title, result.price, result.img, id)
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
        metroScraper(barcode12, page).then( result => {
            console.log(result)
            if (result != null) {
                insertSuperC(result.title, result.price, result.img, id)
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


export { addProduct, getProducts, removeProduct, getBarcodes }
