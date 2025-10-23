import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoistureDisplay } from "@/components/MoistureDisplay";
import { PumpStatus } from "@/components/PumpStatus";
import { Droplets, Wifi, Clock } from "lucide-react";

const Index = () => {
  const [moistureLevel, setMoistureLevel] = useState(72);
  const [pumpOn, setPumpOn] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate moisture level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setMoistureLevel(prev => {
        const change = pumpOn ? 2 : -1;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [pumpOn]);

  // Auto mode logic
  useEffect(() => {
    if (autoMode && moistureLevel < 40) {
      setPumpOn(true);
    } else if (autoMode && moistureLevel > 70) {
      setPumpOn(false);
    }
  }, [autoMode, moistureLevel]);

  const handleStartPump = () => {
    setPumpOn(true);
  };

  const handleStopPump = () => {
    setPumpOn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated water droplet decoration */}
      <div className="absolute top-20 left-1/4 animate-float opacity-20">
        <Droplets className="w-12 h-12 text-accent" />
      </div>
      <div className="absolute bottom-32 right-1/4 animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <Droplets className="w-16 h-16 text-secondary" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground flex items-center justify-center gap-3">
            <Droplets className="w-12 h-12 text-accent" />
            Smart Plant Watering System
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and control your plant's health in real-time
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="glass-card rounded-3xl p-8 space-y-6 animate-fade-in">
          {/* Moisture Display */}
          <MoistureDisplay value={moistureLevel} />

          {/* Pump Status */}
          <div className="border-t border-border/50 pt-6">
            <PumpStatus isOn={pumpOn} />
          </div>

          {/* Auto Mode Toggle */}
          <div className="flex items-center justify-center gap-3 py-4 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">Auto Mode</span>
            <Switch 
              checked={autoMode} 
              onCheckedChange={setAutoMode}
              className="data-[state=checked]:bg-success"
            />
            <span className={`text-xs ${autoMode ? 'text-success' : 'text-muted-foreground'}`}>
              {autoMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              variant="success"
              size="lg"
              onClick={handleStartPump}
              disabled={pumpOn}
              className="w-full text-base font-semibold py-6"
            >
              <Droplets className="w-5 h-5" />
              Start Pump
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={handleStopPump}
              disabled={!pumpOn}
              className="w-full text-base font-semibold py-6"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="w-5 h-5"
              >
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
              Stop Pump
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="glass rounded-2xl p-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Wifi className="w-4 h-4 text-success" />
            <span className="font-medium">Wi-Fi Connected</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last Update: {currentTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
