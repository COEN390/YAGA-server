import { getAllBarcodes } from "./db.mjs";
import { maxiScraper } from "./maxiScraper.mjs";
import { metroScraper } from "./metroScraper.mjs";
import { getPage } from "./setupBrowser.mjs";
import { supercScraper } from "./superCScraper.mjs";
import { getBarcodeData } from "./db.mjs";

const message = (ws, msg, wss) => {
    console.log('Received:', msg);
}

const close = (intervalId) => {
    console.log('Client disconnected');
    clearInterval(intervalId);

}

const connection = async (ws, wss) => {
  
    ws.on('message', (msg) => message(ws, msg, wss));

    const maxiPage = await getPage()
    const superCPage = await getPage()
    const metroPage = await getPage()

    const intervalId = setInterval(() => {
        clientRoutin(ws,wss, maxiPage, superCPage, metroPage)
    }, 10000);


    clientRoutin(ws,wss, maxiPage, superCPage, metroPage)
    ws.on('close', () => close(intervalId));
};

const clientRoutin = (ws, wss, maxiPage, superCPage, metroPage) => {


    /*
    getAllBarcodes().then(barcodes => {
    
        maxiRoutin(ws, wss, barcodes, maxiPage).then(res =>
            console.log(res)
        )

        superCRoutin(ws, wss, barcodes, superCPage).then(res => 
            console.log(res)
        )

        metroRoutin(ws, wss, barcodes, metroPage).then(res =>
            console.log(res)
        )

    })*/


    getAllBarcodes().then(barcodes => {

        for(const b of barcodes) {
            getBarcodeData('maxi',b.id).then(data => {
                data["barcode"] = b.barcode
                data["store"] = "maxi"
                const str = JSON.stringify(data);
                ws.send(str)        
            }).catch(err => { console.log(err)})

            getBarcodeData('super_c',b.id).then(data => {
                data["barcode"] = b.barcode
                data["store"] = "maxi"
                const str = JSON.stringify(data);
                ws.send(str)        
            }).catch(err => { console.log(err)})

            getBarcodeData('metro',b.id).then(data => {
                data["barcode"] = b.barcode
                data["store"] = "maxi"
                const str = JSON.stringify(data);
                ws.send(str)        
            }).catch(err => { console.log(err)})
        }
    })
}

const maxiRoutin = async (ws, wss, barcodes, page) => {
    for (const b of barcodes) {
        const data = await maxiScraper(b.barcode, page)
        if(data) {
            data["barcode"] = b.barcode
            data["store"] = "maxi"
            const str = JSON.stringify(data);
            ws.send(str)        
        }
    }

    return "Maxi Routin is done"
}

const superCRoutin = async (ws, wss, barcodes, page) => {

    for (const b of barcodes) {
        const barcode12 = b.barcode.slice(1);
        const data = await supercScraper(barcode12, page)
        if(data) {
            data["barcode"] = b.barcode
            data["store"] = "superC"
            const str = JSON.stringify(data);
            ws.send(str)        
        }
    }
    return "Super C Routin is done"
}

const metroRoutin = async (ws, wss, barcodes, page) => {
        for (const b of barcodes) {
        const barcode12 = b.barcode.slice(1);
        const data = await metroScraper(barcode12, page)
        if(data) {
            data["barcode"] = b.barcode
            data["store"] = "metro"
            const str = JSON.stringify(data);
            ws.send(str)        
        }
    }
    return "Super C Routin is done"
}


export { connection }