import { 
  Power, 
  Home, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Download,
  Upload,
  Wifi,
  WifiOff
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  selectedDrone: string | null;
  emergencyMode: boolean;
}

export const ActionBar = ({ selectedDrone, emergencyMode }: ActionBarProps) => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connected, setConnected] = useState(true);
  const [quickNote, setQuickNote] = useState("");

  const handleEmergencyStop = () => {
    console.log("EMERGENCY STOP ALL DRONES");
    // Emergency stop implementation
  };

  const handleReturnToHome = () => {
    console.log("RTH ALL DRONES");
    // Return to home implementation
  };

  const handleDataDownload = () => {
    console.log("Downloading mission data...");
    // Data download implementation
  };

  const handleQuickNote = () => {
    if (quickNote.trim()) {
      console.log("Adding note:", quickNote);
      setQuickNote("");
      // Note logging implementation
    }
  };

  return (
    <div className="h-full tactical-panel flex items-center justify-between px-6">
      {/* Emergency Controls */}
      <div className="flex items-center gap-3">
        <Button
          className="emergency-button h-12 px-6 animate-status-pulse"
          onClick={handleEmergencyStop}
        >
          <Power className="w-5 h-5 mr-2" />
          EMERGENCY STOP
        </Button>

          <Button
          className="tactical-button h-12 px-4"
          onClick={handleReturnToHome}
          disabled={!selectedDrone}
        >
          <Home className="w-5 h-5 mr-2" />
          RTH ALL
        </Button>

        {emergencyMode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-status-critical/20 rounded border border-status-critical animate-alert-blink">
            <AlertTriangle className="w-5 h-5 text-status-critical" />
            <span className="text-sm font-bold text-status-critical">
              EMERGENCY MODE ACTIVE
            </span>
          </div>
        )}
      </div>

      {/* Communication Controls */}
      <div className="flex items-center gap-4">
        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          <Button
            className={`tactical-button h-10 w-10 p-0 ${micEnabled ? 'bg-status-safe text-background' : ''}`}
            onClick={() => setMicEnabled(!micEnabled)}
          >
            {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button
            className={`tactical-button h-10 w-10 p-0 ${audioEnabled ? 'bg-status-safe text-background' : ''}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Quick Notes */}
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="Quick note..."
            className="w-48 px-3 py-1 bg-input border border-border rounded text-sm font-mono"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickNote()}
          />
          <Button
            className="tactical-button h-8 px-3 text-xs"
            onClick={handleQuickNote}
            disabled={!quickNote.trim()}
          >
            LOG
          </Button>
        </div>
      </div>

      {/* System Status & Data */}
      <div className="flex items-center gap-4">
        {/* Data Controls */}
        <div className="flex items-center gap-2">
          <Button
            className="tactical-button h-10 w-10 p-0"
            onClick={handleDataDownload}
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            className="tactical-button h-10 w-10 p-0"
          >
            <Upload className="w-4 h-4" />
          </Button>
        <div className="h-8 w-px bg-border" />

        {/* Connection Status */}
        <div className="flex items-center gap-2">
            <Button
              className={`tactical-button h-10 w-10 p-0 ${connected ? 'bg-status-safe text-background' : 'bg-status-critical text-background'}`}
              onClick={() => setConnected(!connected)}
            >
              {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </Button>
            <div className="text-xs text-muted-foreground">
              {connected ? "GCS-1 ACTIVE" : "NO SIGNAL"}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* System Resources */}
        <div className="text-right">
          <div className="text-xs font-mono text-foreground">
            CPU: 23% | MEM: 45%
          </div>
          <div className="text-xs text-muted-foreground">
            UPTIME: 02:14:33
          </div>
        </div>
      </div>
    </div>
  );
};