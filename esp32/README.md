# ESP32 Arduino Code for Smart Plant Watering System

This folder contains example ESP32 code that works with the Vercel dashboard.

## Hardware Requirements
- ESP32 DevKit
- Capacitive Soil Moisture Sensor
- Water pump (5V relay module)
- Power supply

## Pin Configuration
```
Moisture Sensor → GPIO 34 (ADC1_CH6)
Pump Relay     → GPIO 25
LED Indicator  → GPIO 2 (built-in LED)
```

## Setup Instructions

1. Install Arduino IDE and ESP32 board support
2. Install required libraries:
   - WiFi (built-in)
   - WebServer (built-in)
   - ArduinoJson (v6.x)

3. Update WiFi credentials in `esp32_plant_watering.ino`
4. Upload code to ESP32
5. Note the IP address from Serial Monitor
6. Update `.env.local` with ESP32 IP address

## API Endpoints

The ESP32 will host these endpoints:

- `GET /api/moisture` - Returns current moisture level
- `GET /api/pump/status` - Returns pump on/off status
- `POST /api/pump/start` - Turns pump ON
- `POST /api/pump/stop` - Turns pump OFF
- `POST /api/auto-mode` - Enables/disables auto watering

## Example Response Format

```json
// GET /api/moisture
{
  "value": 72,
  "timestamp": 1634567890
}

// GET /api/pump/status
{
  "isOn": true,
  "timestamp": 1634567890
}
```

## CORS Configuration

The ESP32 code includes CORS headers to allow requests from your Vercel domain:
```cpp
server.sendHeader("Access-Control-Allow-Origin", "*");
server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
```

For production, replace `"*"` with your Vercel URL:
```cpp
server.sendHeader("Access-Control-Allow-Origin", "https://your-app.vercel.app");
```

## Testing

1. Open Serial Monitor (115200 baud)
2. Note the ESP32 IP address
3. Test endpoints with browser or Postman:
   - `http://ESP32_IP/api/moisture`
   - `http://ESP32_IP/api/pump/status`

## Troubleshooting

**ESP32 not connecting to WiFi:**
- Check WiFi credentials
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Check Serial Monitor for error messages

**Dashboard not connecting to ESP32:**
- Verify ESP32 IP address in `.env.local`
- Check that both devices are on same network
- Verify CORS headers are set correctly
- Check browser console for errors

**Moisture sensor reading 0 or 100:**
- Calibrate sensor min/max values
- Check sensor wiring
- Ensure sensor is powered correctly
