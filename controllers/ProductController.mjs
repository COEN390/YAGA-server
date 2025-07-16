
import { insertProduct } from "../helpers/db.mjs";
import { maxiScraper } from "../helpers/maxScraper.mjs";

// testing
const getProduct = (req, res) => {

    return res.status(201).json({ message : 'role is created'})
}

const addProduct = (req, res) => {

    let { barcode } = req.body;

    // Todo
    // find if i need to remove extra zero or not
    // if (barcode.length == 13) {
    //     barcode = barcode.slice(1);
    // }

    console.log(barcode)
    maxiScraper(barcode).then( result => {

        // Todo
        // insert the result to db
        console.log(result)
    })


    return res.status(200).json({ message : 'barcode received'})
}


export { addProduct, getProduct }
