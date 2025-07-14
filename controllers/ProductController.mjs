
import { insertProduct } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxScraper.mjs";


const getProduct = (req, res) => {

    return res.status(201).json({ message : 'role is created'})
}

const addProduct = (req, res) => {

    let { barcode } = req.body;

    if (barcode.length == 13) {
        barcode = barcode.slice(1);
    }

    console.log(barcode)
    maxiScraper(barcode).then( result => {

        console.log(result)
    })


    return res.status(201).json({ message : 'role is created'})
}


export { addProduct, getProduct }