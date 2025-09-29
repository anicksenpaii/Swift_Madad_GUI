import { useState } from "react";
import { Home, Navigation, AlertTriangle, Users } from "lucide-react";
import { DroneData, CasualtyData } from "@/hooks/useTacticalData";

interface TacticalMapProps {
  drones: DroneData[];
  casualties: CasualtyData[];
  selectedDrone: string | null;
  onSelectDrone: (droneId: string | null) => void;
}

export const TacticalMap = ({ drones, casualties, selectedDrone, onSelectDrone }: TacticalMapProps) => {
  const [mapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
  const [zoom] = useState(15);

  // Convert real coordinates to map pixel coordinates (simplified)
  const coordToPixel = (coord: { lat: number; lng: number }) => {
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;
    const scale = Math.pow(2, zoom) * 256 / 360;
    
    const x = (coord.lng - centerLng) * scale * Math.cos(centerLat * Math.PI / 180) + 400;
    const y = (centerLat - coord.lat) * scale + 300;
    
    return { x: Math.max(0, Math.min(800, x)), y: Math.max(0, Math.min(600, y)) };
  };

  const getDroneStatusClass = (status: DroneData["status"]) => {
    switch (status) {
      case "active": return "drone-active";
      case "returning": return "drone-returning";
      case "emergency": return "drone-emergency";
      case "offline": return "drone-offline";
      default: return "drone-offline";
    }
  };

  const getCasualtyStatusColor = (priority: CasualtyData["priority"]) => {
    switch (priority) {
      case "critical": return "bg-status-critical";
      case "urgent": return "bg-priority-medium";
      case "delayed": return "bg-status-caution";
      case "deceased": return "bg-status-inactive";
      default: return "bg-status-inactive";
    }
  };

  return (
    <div className="h-full w-full relative tactical-map">
      {/* Map Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="text-primary/30">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Geofence Circle */}
      <div 
        className="absolute geofence-circle"
        style={{
          left: "200px",
          top: "100px",
          width: "400px",
          height: "400px",
        }}
      />

      {/* Home Base */}
      <div 
        className="absolute flex items-center justify-center w-8 h-8 bg-status-safe rounded-full shadow-glow-safe"
        style={{ left: "396px", top: "296px" }}
      >
        <Home className="w-4 h-4 text-background" />
      </div>

      {/* Drone Markers */}
      {drones.map((drone) => {
        const pos = coordToPixel(drone.position);
        const isSelected = selectedDrone === drone.id;
        
        return (
          <div key={drone.id} className="absolute">
            {/* Drone Marker */}
            <div
              className={`drone-marker ${getDroneStatusClass(drone.status)} cursor-pointer ${
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-125" : ""
              }`}
              style={{ 
                left: pos.x - 12, 
                top: pos.y - 12,
                transform: `rotate(${drone.heading}deg)`,
              }}
              onClick={() => onSelectDrone(drone.id)}
            >
              <Navigation className="w-3 h-3" />
            </div>

            {/* Drone Label */}
            <div 
              className="absolute hud-element px-2 py-1 text-xs font-mono whitespace-nowrap"
              style={{ left: pos.x + 16, top: pos.y - 8 }}
            >
              <div className="font-semibold">{drone.callsign}</div>
              <div className="text-muted-foreground">
                ALT: {drone.altitude}m | BAT: {drone.battery}%
              </div>
            </div>

            {/* Flight Path Trail */}
            {drone.status === "active" && (
              <div 
                className="absolute w-1 h-20 bg-primary/30 rounded-full animate-pulse"
                style={{ 
                  left: pos.x - 2, 
                  top: pos.y + 20,
                  transform: `rotate(${drone.heading}deg)`,
                  transformOrigin: "center top",
                }}
              />
            )}
          </div>
        );
      })}

      {/* Casualty Markers */}
      {casualties.map((casualty) => {
        const pos = coordToPixel(casualty.position);
        
        return (
          <div key={casualty.id} className="absolute">
            {/* Casualty Marker */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${getCasualtyStatusColor(casualty.priority)} border-2 border-background shadow-lg animate-status-pulse`}
              style={{ left: pos.x - 12, top: pos.y - 12 }}
            >
              {casualty.priority === "critical" ? (
                <AlertTriangle className="w-3 h-3 text-background" />
              ) : (
                <Users className="w-3 h-3 text-background" />
              )}
            </div>

            {/* Casualty Info */}
            <div 
              className="absolute hud-element px-2 py-1 text-xs font-mono w-48"
              style={{ left: pos.x + 16, top: pos.y - 16 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">CASUALTY {casualty.id}</span>
                <span className={`mission-status ${
                  casualty.priority === "critical" ? "status-alert" : 
                  casualty.priority === "urgent" ? "status-standby" : 
                  "status-active"
                }`}>
                  {casualty.priority.toUpperCase()}
                </span>
              </div>
              <div className="text-muted-foreground">
                {casualty.description}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Discovered: {casualty.discoveredAt.toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Scale */}
      <div className="absolute bottom-4 left-4 hud-element px-3 py-2">
        <div className="text-xs font-mono">
          <div>SCALE 1:{zoom * 1000}</div>
          <div className="flex items-center mt-1">
            <div className="w-12 h-0.5 bg-primary mr-2"></div>
            <span>100m</span>
          </div>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4 hud-element w-16 h-16 flex items-center justify-center">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 border-2 border-primary rounded-full animate-tactical-scan"></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
          </div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold text-primary">
            N
          </div>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 right-4 hud-element px-3 py-2">
        <div className="text-xs font-mono">
          <div>CENTER: {mapCenter.lat.toFixed(6)}°N</div>
          <div>{Math.abs(mapCenter.lng).toFixed(6)}°W</div>
        </div>
      </div>
    </div>
  );
};