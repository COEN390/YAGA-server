import asyncio
import websockets

async def connect():
    uri = "ws://34.59.48.7:8080"
    async with websockets.connect(uri) as websocket:
        while True:
            response = await websocket.recv()
            print("Received:", response)


asyncio.run(connect())
