
import { insertProduct } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxScraper.mjs";
import { supercScraper } from "../helpers/superCScraper.mjs";

// testing
const getProduct = (req, res) => {

    return res.status(201).json({ message : 'role is created'})
}

const addProduct = (req, res) => {

    // Todo!!!
    // need to make sure it is not fucked
    let { barcode } = req.body;

    // Todo
    // find if i need to remove extra zero or not
    // if (barcode.length == 13) {
    //     barcode = barcode.slice(1);
    // }

    console.log(barcode)
    maxiScraper(barcode).then( result => {

        console.log(result)

        if (result != null) {
            insertProduct(result.title, result.price, result.img)
        }
    })

    supercScraper(barcode).then( result => {
        console.log(result)
        if (result != null) {
            insertProduct(result.title, result.price, result.img)
        }
    })
    


    return res.status(200).json({ message : 'barcode received'})
}


export { addProduct, getProduct }
