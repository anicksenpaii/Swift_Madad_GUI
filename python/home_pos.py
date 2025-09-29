from pymavlink import mavutil
import asyncio
import websockets
import json
import sys

# --- Configuration ---
SITL_ADDRESS = "udp:127.0.0.1:14550"
WEBSOCKET_PORT = 8765

# --- Connect to SITL ---
print(f"Connecting to SITL on {SITL_ADDRESS}...")
try:
    master = mavutil.mavlink_connection(SITL_ADDRESS)
    master.wait_heartbeat()
    print("✅ Connected to SITL")
except Exception as e:
    print(f"❌ Could not connect to SITL: {e}")
    sys.exit(1)


# --- Get Home Position ---
print("Requesting home position...")
master.mav.command_long_send(
    master.target_system, master.target_component,
    mavutil.mavlink.MAV_CMD_GET_HOME_POSITION, 0, 0, 0, 0, 0, 0, 0, 0)

home = master.recv_match(type="HOME_POSITION", blocking=True, timeout=10)

if not home:
    print("❌ Failed to get home position from SITL. Exiting.")
    sys.exit(1)

home_lat = home.latitude / 1e7
home_lon = home.longitude / 1e7
print(f"✅ HOME: lat={home_lat}, lon={home_lon}")


# --- WebSocket Server Logic ---
# CORRECTED: Removed the unused 'path' argument from the function definition
async def telemetry_server(websocket):
    print("🔗 WebSocket client connected.")
    await websocket.send(json.dumps({"type": "home", "lat": home_lat, "lon": home_lon}))

    try:
        while True:
            # Use a small sleep to prevent this loop from blocking the event loop entirely
            await asyncio.sleep(0.01) 
            msg = master.recv_match(type="GLOBAL_POSITION_INT", blocking=False)
            if msg:
                data = {
                    "type": "telemetry",
                    "lat": msg.lat / 1e7,
                    "lon": msg.lon / 1e7,
                    "alt": msg.relative_alt / 1000.0,
                }
                await websocket.send(json.dumps(data))
    except websockets.exceptions.ConnectionClosed:
        print("🔌 WebSocket client disconnected.")
    except Exception as e:
        print(f"An error occurred: {e}")

# --- Main function to start the server ---
async def main():
    # The 'with' statement ensures the server is properly closed
    async with websockets.serve(telemetry_server, "0.0.0.0", WEBSOCKET_PORT):
        print(f"🚀 WebSocket server started on port {WEBSOCKET_PORT}...")
        await asyncio.Future()  # This will run forever

# --- Run the main function ---
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down server.")

