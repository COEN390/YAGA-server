

const message = (ws, msg, wss) => {
    console.log('Received:', msg);
}

const close = () => {
    console.log('Client disconnected');
}

const connection = (ws, wss) => {
  
    ws.on('message', (msg) => message(ws, msg, wss));
  
    ws.on('close', close);
  
    ws.send('Welcome from server!');
};


export { connection }