
import { insertBarcode, insertMaxi, insertSuperC, removeBarcode } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxiScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
import { getPage } from "../helpers/setupBrowser.mjs";
import { supercScraper } from "../helpers/superCScraper.mjs";

// testing
const getProduct = (req, res) => {
    return res.status(201).json({ message : 'role is created'})
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


export { addProduct, getProduct, removeProduct }
