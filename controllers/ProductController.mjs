
import { insertBarcode, insertMaxi, insertSuperC } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxScraper.mjs";
import { metroScraper } from "../helpers/metroScraper.mjs";
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

    maxiScraper(barcode).then( result => {

        console.log(result)

        if (result != null) {
            insertMaxi(result.title, result.price, result.img, id)
        }
    })

    const barcode12 = barcode.slice(1);
    supercScraper(barcode12).then( result => {
        console.log(result)
        if (result != null) {
            insertSuperC(result.title, result.price, result.img, id)
        }
    })

    metroScraper(barcode12).then( result => {
        console.log(result)
        if (result != null) {
            insertSuperC(result.title, result.price, result.img, id)
        }
    })

    return res.status(200).json({ message : 'barcode received'})
}


export { addProduct, getProduct }
