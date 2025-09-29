import { Plane, Settings, Target, Home, Square, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DronePosition {
  id: string;
  lat: number;
  lon: number;
  hdg?: number;
  color?: string;
}

interface DronePanelProps {
  dronePositions: DronePosition[];
  mainDrone: DronePosition | null;
  selectedDrone: string | null;
}

export const DronePanel = ({ dronePositions, mainDrone, selectedDrone }: DronePanelProps) => {
  // Combine all available drones
  const allDrones = dronePositions.length > 0 ? dronePositions : (mainDrone ? [mainDrone] : []);
  const selectedDroneData = selectedDrone ? allDrones.find(d => d.id === selectedDrone) : null;

  const handleCommand = (command: string) => {
    console.log(`Executing command: ${command} for drone: ${selectedDrone}`);
    // Command execution would be implemented here
  };

  return (
    <div className="h-full tactical-panel">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Plane className="w-5 h-5" />
          DRONE CONTROL
        </h2>
        <div className="text-xs text-muted-foreground mt-1">
          {selectedDrone ? `CONTROLLING ${selectedDroneData?.id}` : "SELECT DRONE TO CONTROL"}
        </div>
      </div>

      {selectedDroneData ? (
        <div className="flex-1 overflow-y-auto">
          {/* Drone Status Summary */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground">{selectedDroneData.id}</h3>
              <span className="mission-status status-active">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Battery:</span>
                <span className="ml-2 font-mono font-bold">
                  87%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Altitude:</span>
                <span className="ml-2 font-mono font-bold">
                  120m
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Speed:</span>
                <span className="ml-2 font-mono font-bold">
                  15 m/s
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Heading:</span>
                <span className="ml-2 font-mono font-bold">
                  {(selectedDroneData.hdg || 0).toString().padStart(3, '0')}°
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground">CURRENT MISSION:</div>
              <div className="text-sm font-mono mt-1">Search Grid A1-A4</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              QUICK ACTIONS
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleCommand("RTH")}
                className="tactical-button text-xs h-8"
                disabled={!selectedDroneData}
              >
                <Home className="w-3 h-3 mr-1" />
                RTH
              </Button>
              
              <Button 
                onClick={() => handleCommand("HOLD")}
                className="tactical-button text-xs h-8"
                disabled={!selectedDroneData}
              >
                <Square className="w-3 h-3 mr-1" />
                HOLD
              </Button>
              
              <Button 
                onClick={() => handleCommand("RESUME")}
                className="tactical-button text-xs h-8"
                disabled={!selectedDroneData}
              >
                <Play className="w-3 h-3 mr-1" />
                RESUME
              </Button>
              
              <Button 
                onClick={() => handleCommand("ORBIT")}
                className="tactical-button text-xs h-8"
                disabled={!selectedDroneData}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                ORBIT
              </Button>
            </div>
          </div>

          {/* Mission Planning */}
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              MISSION PARAMS
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  SEARCH ALTITUDE (m)
                </label>
                <input 
                  type="number" 
                  className="w-full px-2 py-1 bg-input border border-border rounded text-sm font-mono"
                  defaultValue={120}
                  min="10"
                  max="200"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  SEARCH SPEED (m/s)
                </label>
                <input 
                  type="number" 
                  className="w-full px-2 py-1 bg-input border border-border rounded text-sm font-mono"
                  defaultValue={15}
                  min="1"
                  max="20"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  SEARCH PATTERN
                </label>
                <select className="w-full px-2 py-1 bg-input border border-border rounded text-sm font-mono">
                  <option value="grid">Grid Search</option>
                  <option value="spiral">Spiral Search</option>
                  <option value="perimeter">Perimeter Search</option>
                  <option value="waypoint">Waypoint Navigation</option>
                </select>
              </div>
              
              <Button 
                className="w-full tactical-button text-xs h-8 mt-3"
                onClick={() => handleCommand("UPDATE_MISSION")}
                disabled={!selectedDroneData}
              >
                UPDATE MISSION
              </Button>
            </div>
          </div>

          {/* Sensor Controls */}
          <div className="p-4">
            <h4 className="text-sm font-bold text-primary mb-3">
              SENSOR CONTROLS
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">THERMAL IMAGING</span>
                <button className="w-12 h-6 bg-status-safe rounded-full relative">
                  <div className="w-4 h-4 bg-background rounded-full absolute right-1 top-1 transition-all"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">OPTICAL ZOOM</span>
                <button className="w-12 h-6 bg-muted rounded-full relative">
                  <div className="w-4 h-4 bg-background rounded-full absolute left-1 top-1 transition-all"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">RECORDING</span>
                <button className="w-12 h-6 bg-status-critical rounded-full relative">
                  <div className="w-4 h-4 bg-background rounded-full absolute right-1 top-1 transition-all"></div>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted-foreground block mb-1">
                GIMBAL ANGLE
              </label>
              <input 
                type="range" 
                className="w-full" 
                min="-90" 
                max="30" 
                defaultValue="-45"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>-90°</span>
                <span>-45°</span>
                <span>30°</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div className="text-sm">Select a drone from the map</div>
            <div className="text-xs">to access controls</div>
          </div>
        </div>
      )}
    </div>
  );
};