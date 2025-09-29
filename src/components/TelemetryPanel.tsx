import { Battery, Radio, Clock, Navigation, Gauge, Wifi, Video } from "lucide-react";

interface DronePosition {
  id: string;
  lat: number;
  lon: number;
  hdg?: number;
  color?: string;
}

interface TelemetryPanelProps {
  dronePositions: DronePosition[];
  mainDrone: DronePosition | null;
  selectedDrone: string | null;
  onSelectDrone: (droneId: string | null) => void;
}

export const TelemetryPanel = ({ dronePositions, mainDrone, selectedDrone, onSelectDrone }: TelemetryPanelProps) => {
  // Combine all available drones
  const allDrones = dronePositions.length > 0 ? dronePositions : (mainDrone ? [mainDrone] : []);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-status-safe";
    if (battery > 25) return "text-status-caution";
    return "text-status-critical";
  };

  const getSignalColor = (signal: number) => {
    if (signal > 80) return "text-status-safe";
    if (signal > 50) return "text-status-caution";
    return "text-status-critical";
  };

  return (
    <div className="h-full tactical-panel">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Video className="w-5 h-5" />
          DRONE FEEDS
        </h2>
        <div className="text-xs text-muted-foreground mt-1">
          {allDrones.length} CONNECTED ASSETS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Camera Feeds Section */}
        <div className="p-4 border-b border-border">
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src="/drone1_feed.jpg" 
                alt="Drone 1 Camera Feed" 
                className="w-full h-32 object-cover rounded border-2 border-status-caution"
              />
              <p className="text-xs font-mono text-status-caution mt-1">Drone1_camera_feed</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/traversable_path.png" 
                alt="Traversable Path Analysis" 
                className="w-full h-32 object-cover rounded border-2 border-status-safe"
              />
              <p className="text-xs font-mono text-status-safe mt-1">Traversable_Path</p>
            </div>
          </div>
        </div>

        {/* Drone Telemetry */}
        {allDrones.map((drone) => (
          <div
            key={drone.id}
            className={`p-4 border-b border-border cursor-pointer transition-all duration-200 ${
              selectedDrone === drone.id 
                ? "bg-primary/10 border-l-4 border-l-primary" 
                : "hover:bg-secondary/50"
            }`}
            onClick={() => onSelectDrone(drone.id)}
          >
            {/* Drone Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="status-indicator status-safe" />
                <span className="font-bold text-primary">{drone.id}</span>
              </div>
              <span className="mission-status status-active">
                ACTIVE
              </span>
            </div>

            {/* Critical Telemetry */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Battery - Simulated */}
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-status-safe" />
                <div className="telemetry-display">
                  <div className="text-sm font-bold text-status-safe">
                    87%
                  </div>
                  <div className="text-xs text-muted-foreground">BAT</div>
                </div>
              </div>

              {/* Signal Strength - Simulated */}
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-status-safe" />
                <div className="telemetry-display">
                  <div className="text-sm font-bold text-status-safe">
                    95%
                  </div>
                  <div className="text-xs text-muted-foreground">SIG</div>
                </div>
              </div>

              {/* Altitude - Simulated */}
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                <div className="telemetry-display">
                  <div className="text-sm font-bold text-foreground">
                    120m
                  </div>
                  <div className="text-xs text-muted-foreground">ALT</div>
                </div>
              </div>

              {/* Speed - Simulated */}
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                <div className="telemetry-display">
                  <div className="text-sm font-bold text-foreground">
                    15 m/s
                  </div>
                  <div className="text-xs text-muted-foreground">SPD</div>
                </div>
              </div>
            </div>

            {/* Flight Data */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">HEADING:</span>
                <span className="font-mono">{(drone.hdg || 0).toString().padStart(3, '0')}°</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">FLIGHT TIME:</span>
                <span className="font-mono">01:32:15</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">POSITION:</span>
                <span className="coordinate-display">
                  {drone.lat.toFixed(6)}°N<br/>
                  {Math.abs(drone.lon).toFixed(6)}°W
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">LAST UPDATE:</span>
                <span className="font-mono">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Current Mission */}
            <div className="mt-3 pt-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground mb-1">MISSION:</div>
              <div className="text-xs font-mono text-foreground">
                Search Grid A1-A4
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};