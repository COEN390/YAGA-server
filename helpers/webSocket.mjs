import { getProducts } from "./db.mjs";
import { maxiScraper } from "./maxScraper.mjs";


const message = (ws, msg, wss) => {
    console.log('Received:', msg);
}

const close = () => {
    console.log('Client disconnected');
}

const connection = (ws, wss) => {
  
    ws.on('message', (msg) => message(ws, msg, wss));
  
    ws.on('close', close);
    

    scraper_routin(ws,wss)
};

const scraper_routin = async (ws, wss) => {
    const productRow = await getProducts()
    while(true) {
        console.log(productRow)
        for (const element of productRow) {
            console.log(element)
            const data = await maxiScraper(element.name)
            console.log(data)
            console.log("meow")
            if (data != null) {
                ws.send(data.title)
                ws.send(data.price)
                ws.send(data.price)
            }
        }
    }
}


export { connection }