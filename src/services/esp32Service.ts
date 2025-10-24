import { API_CONFIG, buildApiUrl } from "@/config/api";

// Types for API responses
export interface MoistureData {
  value: number;
  timestamp: number;
}

export interface PumpStatus {
  isOn: boolean;
  timestamp: number;
}

export interface AutoModeStatus {
  enabled: boolean;
  threshold: {
    low: number;
    high: number;
  };
}

// Fetch moisture level from ESP32
export const fetchMoistureLevel = async (): Promise<number> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MOISTURE), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MoistureData = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error fetching moisture level:", error);
    throw error;
  }
};

// Fetch pump status from ESP32
export const fetchPumpStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PUMP_STATUS), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PumpStatus = await response.json();
    return data.isOn;
  } catch (error) {
    console.error("Error fetching pump status:", error);
    throw error;
  }
};

// Start the pump
export const startPump = async (): Promise<void> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PUMP_START), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error starting pump:", error);
    throw error;
  }
};

// Stop the pump
export const stopPump = async (): Promise<void> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PUMP_STOP), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error stopping pump:", error);
    throw error;
  }
};

// Set auto mode
export const setAutoMode = async (enabled: boolean): Promise<void> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTO_MODE), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error setting auto mode:", error);
    throw error;
  }
};
