import { getAllBarcodes } from "./db.mjs";
import { maxiScraper } from "./maxiScraper.mjs";
import { supercScraper } from "./superCScraper.mjs";

const message = (ws, msg, wss) => {
    console.log('Received:', msg);
}

const close = (intervalId) => {
    console.log('Client disconnected');
    clearInterval(intervalId);

}

const connection = (ws, wss) => {
  
    ws.on('message', (msg) => message(ws, msg, wss));
  
    const intervalId = setInterval(() => {
        clientRoutin(ws,wss)
    }, 30000);


    ws.on('close', () => close(intervalId));
    

};

const clientRoutin = (ws, wss) => {

    getAllBarcodes().then(barcodes => {
    
        maxiRoutin(ws, wss, barcodes).then(res =>
            console.log(res)
        )

        superCRoutin(ws, wss, barcodes).then(res => 
            console.log(res)
        )
    })
}

const maxiRoutin = async (ws, wss, barcodes) => {
    for (const b of barcodes) {
        const data = await maxiScraper(b.barcode)
        const str = JSON.stringify(data);
        ws.send(str)        
    }

    return "Maxi Routin is done"
}

const superCRoutin = async (ws, wss, barcodes) => {

    for (const b of barcodes) {
        const barcode12 = b.barcode.slice(1);
        const data = await supercScraper(barcode12)
        const str = JSON.stringify(data)
        ws.send(str)
    }

    return "Super C Routin is done"
}

export { connection }