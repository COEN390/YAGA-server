import asyncio
import websockets

async def connect():
    uri = "ws://localhost:8080"
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello from Python (async)")
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(connect())
