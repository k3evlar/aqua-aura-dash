// API Configuration for ESP32 Integration

// Replace this with your ESP32's IP address or domain
// For local testing: use your ESP32's local IP (e.g., "http://192.168.1.100")
// For production: use a cloud service or ngrok tunnel
export const API_CONFIG = {
  // ESP32 API endpoint - Update this with your ESP32 IP/domain
  ESP32_BASE_URL: import.meta.env.VITE_ESP32_API_URL || "http://192.168.1.100",
  
  // API endpoints
  ENDPOINTS: {
    MOISTURE: "/api/moisture",
    PUMP_STATUS: "/api/pump/status",
    PUMP_START: "/api/pump/start",
    PUMP_STOP: "/api/pump/stop",
    AUTO_MODE: "/api/auto-mode",
  },
  
  // Polling interval for fetching data (in milliseconds)
  POLL_INTERVAL: 2000, // 2 seconds
  
  // Request timeout
  TIMEOUT: 5000, // 5 seconds
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.ESP32_BASE_URL}${endpoint}`;
};
