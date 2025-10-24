/*
 * ESP32 Smart Plant Watering System
 * 
 * This code creates a web server on ESP32 that:
 * - Reads soil moisture from capacitive sensor
 * - Controls a water pump via relay
 * - Provides REST API for Vercel dashboard
 * - Supports auto-watering mode
 * 
 * Hardware Connections:
 * - Moisture Sensor: GPIO 34 (ADC1_CH6)
 * - Pump Relay: GPIO 25
 * - LED Indicator: GPIO 2 (built-in)
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi credentials - UPDATE THESE
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Pin definitions
const int MOISTURE_PIN = 34;  // ADC1_CH6
const int PUMP_PIN = 25;
const int LED_PIN = 2;

// Sensor calibration values (adjust based on your sensor)
const int DRY_VALUE = 3200;    // Sensor value in dry soil
const int WET_VALUE = 1400;    // Sensor value in wet soil

// Auto mode settings
bool autoModeEnabled = false;
const int AUTO_LOW_THRESHOLD = 40;   // Start pump below 40%
const int AUTO_HIGH_THRESHOLD = 70;  // Stop pump above 70%

// State variables
bool pumpOn = false;
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 2000;  // Read sensor every 2 seconds

WebServer server(80);

// Function to read and convert moisture level to percentage
int readMoistureLevel() {
  int rawValue = analogRead(MOISTURE_PIN);
  
  // Convert to percentage (0-100%)
  int percentage = map(rawValue, DRY_VALUE, WET_VALUE, 0, 100);
  percentage = constrain(percentage, 0, 100);
  
  return percentage;
}

// Control pump
void setPumpState(bool state) {
  pumpOn = state;
  digitalWrite(PUMP_PIN, state ? HIGH : LOW);
  digitalWrite(LED_PIN, state ? HIGH : LOW);
  Serial.println(state ? "Pump ON" : "Pump OFF");
}

// Auto mode logic
void handleAutoMode() {
  if (!autoModeEnabled) return;
  
  int moisture = readMoistureLevel();
  
  if (moisture < AUTO_LOW_THRESHOLD && !pumpOn) {
    setPumpState(true);
    Serial.println("Auto mode: Moisture low, starting pump");
  } else if (moisture > AUTO_HIGH_THRESHOLD && pumpOn) {
    setPumpState(false);
    Serial.println("Auto mode: Moisture sufficient, stopping pump");
  }
}

// CORS headers
void setCORSHeaders() {
  // For production, replace "*" with your Vercel URL
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Handle OPTIONS requests (CORS preflight)
void handleOptions() {
  setCORSHeaders();
  server.send(204);
}

// GET /api/moisture - Returns current moisture level
void handleGetMoisture() {
  setCORSHeaders();
  
  int moisture = readMoistureLevel();
  
  StaticJsonDocument<200> doc;
  doc["value"] = moisture;
  doc["timestamp"] = millis() / 1000;
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
  Serial.printf("Moisture: %d%%\n", moisture);
}

// GET /api/pump/status - Returns pump status
void handleGetPumpStatus() {
  setCORSHeaders();
  
  StaticJsonDocument<200> doc;
  doc["isOn"] = pumpOn;
  doc["timestamp"] = millis() / 1000;
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}

// POST /api/pump/start - Start pump
void handleStartPump() {
  setCORSHeaders();
  
  if (autoModeEnabled) {
    server.send(400, "application/json", "{\"error\":\"Cannot manually control pump in auto mode\"}");
    return;
  }
  
  setPumpState(true);
  server.send(200, "application/json", "{\"success\":true}");
}

// POST /api/pump/stop - Stop pump
void handleStopPump() {
  setCORSHeaders();
  
  if (autoModeEnabled) {
    server.send(400, "application/json", "{\"error\":\"Cannot manually control pump in auto mode\"}");
    return;
  }
  
  setPumpState(false);
  server.send(200, "application/json", "{\"success\":true}");
}

// POST /api/auto-mode - Set auto mode
void handleSetAutoMode() {
  setCORSHeaders();
  
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, body);
    
    if (error) {
      server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
      return;
    }
    
    autoModeEnabled = doc["enabled"];
    Serial.printf("Auto mode: %s\n", autoModeEnabled ? "ENABLED" : "DISABLED");
    
    server.send(200, "application/json", "{\"success\":true}");
  } else {
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
  }
}

// Handle root path
void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>ESP32 Plant Watering</title></head>";
  html += "<body><h1>ESP32 Smart Plant Watering System</h1>";
  html += "<p>API is running. Use the Vercel dashboard to control the system.</p>";
  html += "<p>API Endpoints:</p><ul>";
  html += "<li>GET /api/moisture</li>";
  html += "<li>GET /api/pump/status</li>";
  html += "<li>POST /api/pump/start</li>";
  html += "<li>POST /api/pump/stop</li>";
  html += "<li>POST /api/auto-mode</li>";
  html += "</ul></body></html>";
  
  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(MOISTURE_PIN, INPUT);
  
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  
  // Connect to WiFi
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Update .env.local with this IP address");
  
  // Setup server routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/api/moisture", HTTP_GET, handleGetMoisture);
  server.on("/api/pump/status", HTTP_GET, handleGetPumpStatus);
  server.on("/api/pump/start", HTTP_POST, handleStartPump);
  server.on("/api/pump/stop", HTTP_POST, handleStopPump);
  server.on("/api/auto-mode", HTTP_POST, handleSetAutoMode);
  
  // Handle OPTIONS for CORS
  server.on("/api/moisture", HTTP_OPTIONS, handleOptions);
  server.on("/api/pump/status", HTTP_OPTIONS, handleOptions);
  server.on("/api/pump/start", HTTP_OPTIONS, handleOptions);
  server.on("/api/pump/stop", HTTP_OPTIONS, handleOptions);
  server.on("/api/auto-mode", HTTP_OPTIONS, handleOptions);
  
  server.begin();
  Serial.println("HTTP server started");
  
  // Blink LED to indicate ready
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

void loop() {
  server.handleClient();
  
  // Handle auto mode
  unsigned long currentTime = millis();
  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;
    handleAutoMode();
  }
}
