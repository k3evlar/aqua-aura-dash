// State
let moistureLevel = 72;
let pumpOn = false;
let autoMode = false;

// DOM Elements
const moistureValueEl = document.getElementById('moistureValue');
const moistureProgressEl = document.getElementById('moistureProgress');
const pumpIndicatorEl = document.getElementById('pumpIndicator');
const pumpPingEl = document.getElementById('pumpPing');
const pumpStatusTextEl = document.getElementById('pumpStatusText');
const autoModeToggleEl = document.getElementById('autoModeToggle');
const autoModeStatusEl = document.getElementById('autoModeStatus');
const startPumpBtn = document.getElementById('startPumpBtn');
const stopPumpBtn = document.getElementById('stopPumpBtn');
const currentTimeEl = document.getElementById('currentTime');

// Update Time
function updateTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString();
}

// Update Moisture Display
function updateMoistureDisplay() {
  moistureValueEl.textContent = moistureLevel;
  
  // Update color class
  moistureValueEl.classList.remove('low', 'medium', 'high');
  if (moistureLevel < 30) {
    moistureValueEl.classList.add('low');
  } else if (moistureLevel < 60) {
    moistureValueEl.classList.add('medium');
  } else {
    moistureValueEl.classList.add('high');
  }
  
  // Update progress bar
  moistureProgressEl.style.width = moistureLevel + '%';
  
  if (moistureLevel < 30) {
    moistureProgressEl.style.background = 'linear-gradient(90deg, hsl(0, 75%, 60%), hsl(15, 70%, 55%))';
    moistureProgressEl.style.boxShadow = 'var(--glow-danger)';
  } else if (moistureLevel < 60) {
    moistureProgressEl.style.background = 'linear-gradient(90deg, hsl(175, 65%, 55%), hsl(180, 70%, 45%))';
    moistureProgressEl.style.boxShadow = 'var(--glow-primary)';
  } else {
    moistureProgressEl.style.background = 'linear-gradient(90deg, hsl(145, 70%, 45%), hsl(160, 65%, 55%))';
    moistureProgressEl.style.boxShadow = 'var(--glow-success)';
  }
}

// Update Pump Status
function updatePumpStatus() {
  if (pumpOn) {
    pumpIndicatorEl.classList.add('active');
    pumpPingEl.classList.add('active');
    pumpStatusTextEl.classList.add('active');
    pumpStatusTextEl.textContent = 'ON';
    startPumpBtn.disabled = true;
    stopPumpBtn.disabled = false;
  } else {
    pumpIndicatorEl.classList.remove('active');
    pumpPingEl.classList.remove('active');
    pumpStatusTextEl.classList.remove('active');
    pumpStatusTextEl.textContent = 'OFF';
    startPumpBtn.disabled = false;
    stopPumpBtn.disabled = true;
  }
}

// Simulate Moisture Changes
function simulateMoisture() {
  const change = pumpOn ? 2 : -1;
  moistureLevel = Math.max(0, Math.min(100, moistureLevel + change));
  updateMoistureDisplay();
}

// Auto Mode Logic
function checkAutoMode() {
  if (autoMode) {
    if (moistureLevel < 40 && !pumpOn) {
      pumpOn = true;
      updatePumpStatus();
    } else if (moistureLevel > 70 && pumpOn) {
      pumpOn = false;
      updatePumpStatus();
    }
  }
}

// Event Listeners
startPumpBtn.addEventListener('click', () => {
  pumpOn = true;
  updatePumpStatus();
});

stopPumpBtn.addEventListener('click', () => {
  pumpOn = false;
  updatePumpStatus();
});

autoModeToggleEl.addEventListener('change', (e) => {
  autoMode = e.target.checked;
  if (autoMode) {
    autoModeStatusEl.textContent = 'Enabled';
    autoModeStatusEl.classList.add('active');
  } else {
    autoModeStatusEl.textContent = 'Disabled';
    autoModeStatusEl.classList.remove('active');
  }
});

// Initialize
updateTime();
updateMoistureDisplay();
updatePumpStatus();

// Start intervals
setInterval(updateTime, 1000);
setInterval(simulateMoisture, 3000);
setInterval(checkAutoMode, 1000);
