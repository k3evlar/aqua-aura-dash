# 🌱 ESP32 + Vercel Integration Guide

Complete guide to connect your ESP32 hardware with the Vercel-hosted dashboard.

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Hardware Setup](#hardware-setup)
3. [ESP32 Setup](#esp32-setup)
4. [Dashboard Configuration](#dashboard-configuration)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Production Setup](#production-setup)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  ESP32 Device   │ ◄─────► │  Local Network   │ ◄─────► │ Vercel Dashboard│
│  (Sensors +     │  HTTP   │  or              │  HTTPS  │  (React App)    │
│   Pump)         │  API    │  Cloud Bridge    │         │                 │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## 🔧 Hardware Setup

### Required Components
- ESP32 DevKit (any variant)
- Capacitive Soil Moisture Sensor
- 5V Water Pump
- 5V Relay Module
- Power Supply (5V 2A recommended)
- Jumper wires

### Wiring Diagram
```
ESP32              Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GPIO 34 (ADC)  ──► Moisture Sensor Signal
GPIO 25        ──► Relay IN (controls pump)
GPIO 2 (LED)   ──► Built-in LED (status)
3.3V           ──► Moisture Sensor VCC
GND            ──► Common Ground

Relay Module:
- VCC ──► 5V
- GND ──► GND
- IN  ──► GPIO 25
- COM ──► Pump +
- NO  ──► Power Supply +
```

---

## 📡 ESP32 Setup

### Step 1: Install Arduino IDE & ESP32 Board Support

1. Download Arduino IDE from https://www.arduino.cc/en/software
2. Go to **File → Preferences**
3. Add to "Additional Board Manager URLs":
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
4. Go to **Tools → Board → Boards Manager**
5. Search for "ESP32" and install "esp32 by Espressif Systems"

### Step 2: Install Required Libraries

Go to **Sketch → Include Library → Manage Libraries** and install:
- `ArduinoJson` (version 6.x)
- WiFi and WebServer are built-in for ESP32

### Step 3: Configure ESP32 Code

1. Open `esp32/esp32_plant_watering.ino`
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Adjust sensor calibration if needed:
   ```cpp
   const int DRY_VALUE = 3200;  // Sensor value in air
   const int WET_VALUE = 1400;  // Sensor value in water
   ```

### Step 4: Upload to ESP32

1. Connect ESP32 via USB
2. Select **Tools → Board → ESP32 Dev Module**
3. Select correct **Port**
4. Click **Upload** button
5. Open **Serial Monitor** (115200 baud)
6. **Note the IP address** displayed (e.g., `192.168.1.100`)

---

## 💻 Dashboard Configuration

### Step 1: Create Environment File

In your local project, create `.env.local`:

```bash
# Replace with your ESP32's IP address
VITE_ESP32_API_URL=http://192.168.1.100
```

### Step 2: Test Locally

```bash
npm run dev
```

Visit http://localhost:8080 and verify:
- ✅ Moisture level updates from ESP32
- ✅ Pump controls work
- ✅ Auto mode functions properly

---

## 🚀 Deployment

### Local Network (Development)

**Option 1: Same WiFi Network**
- ESP32 and computer on same network
- Dashboard connects directly to ESP32 IP
- Works only on local network

### Internet Access (Production)

For remote access, you need to expose ESP32 to internet. Choose one option:

**Option 1: ngrok (Easiest for testing)**
```bash
# Install ngrok: https://ngrok.com/
ngrok http 80

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update VITE_ESP32_API_URL in Vercel environment variables
```

**Option 2: CloudFlare Tunnel (Free & Secure)**
```bash
# Install cloudflared
# Create tunnel to ESP32
cloudflared tunnel --url http://ESP32_IP:80

# Get public URL and use it in Vercel
```

**Option 3: Cloud Backend (Recommended for Production)**
- Set up a backend server (Node.js, Python, etc.)
- ESP32 sends data to backend via MQTT or HTTP
- Vercel dashboard connects to backend API
- More reliable and scalable

---

## 🔐 Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add variable:
   - **Name:** `VITE_ESP32_API_URL`
   - **Value:** `http://YOUR_ESP32_IP` or `https://your-tunnel-url`
   - **Environment:** Production, Preview, Development
5. Click **Save**
6. Redeploy your project

---

## 🧪 Testing

### Test ESP32 API Endpoints

Open browser and test (replace IP with your ESP32 IP):

```
http://192.168.1.100/api/moisture
http://192.168.1.100/api/pump/status
```

### Test with curl (POST requests)

```bash
# Start pump
curl -X POST http://192.168.1.100/api/pump/start

# Stop pump
curl -X POST http://192.168.1.100/api/pump/stop

# Enable auto mode
curl -X POST http://192.168.1.100/api/auto-mode \
  -H "Content-Type: application/json" \
  -d '{"enabled":true}'
```

### Check Browser Console

1. Open dashboard in browser
2. Press **F12** for Developer Tools
3. Go to **Console** tab
4. Look for connection errors or API responses

---

## 🌐 Production Setup Recommendations

### Security
- [ ] Add authentication to ESP32 API
- [ ] Use HTTPS only (via CloudFlare or ngrok)
- [ ] Restrict CORS to your Vercel domain
- [ ] Use environment variables for sensitive data

### Reliability
- [ ] Add retry logic for failed requests
- [ ] Implement WebSocket for real-time updates
- [ ] Add offline detection and user notification
- [ ] Set up health checks and monitoring

### Scalability
- [ ] Consider MQTT broker for multiple devices
- [ ] Use cloud database for data logging
- [ ] Implement caching to reduce API calls
- [ ] Add rate limiting on ESP32

---

## 🐛 Troubleshooting

### ESP32 Won't Connect to WiFi
- Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Check credentials are correct
- Try moving ESP32 closer to router
- Check Serial Monitor for error messages

### Dashboard Shows "Connection Error"
- Verify ESP32 IP address in `.env.local`
- Ensure both devices are on same network
- Check ESP32 is powered on and running
- Test API endpoints directly in browser
- Check CORS headers in browser console

### Moisture Reading is 0 or 100
- Calibrate sensor: put in air (DRY_VALUE) and water (WET_VALUE)
- Check sensor wiring
- Ensure sensor is powered (3.3V for capacitive sensors)

### Pump Doesn't Turn On
- Check relay wiring
- Verify GPIO 25 pin
- Test relay manually with jumper wire
- Check power supply is adequate

---

## 📚 Additional Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp32/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [ArduinoJson Documentation](https://arduinojson.org/)
- [Capacitive Soil Moisture Sensor Guide](https://how2electronics.com/capacitive-soil-moisture-sensor-esp32-esp8266/)

---

## 🆘 Need Help?

1. Check Serial Monitor output from ESP32
2. Check browser console for errors
3. Test API endpoints directly
4. Verify all wiring connections
5. Check Vercel deployment logs

---

**Happy Watering! 🌱💧**
