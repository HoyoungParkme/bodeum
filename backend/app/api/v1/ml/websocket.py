from fastapi import WebSocket


async def ml_websocket(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_json({"status": "connected"})
    await websocket.close()
