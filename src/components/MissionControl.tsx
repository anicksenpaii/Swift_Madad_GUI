import { Clock, MapPin, CloudSun, Eye, AlertTriangle, CheckCircle2, Pause, X } from "lucide-react";
import { MissionData, AlertData } from "@/hooks/useTacticalData";

interface MissionControlProps {
  time: Date;
  mission: MissionData;
  casualtyCount: number;
  alerts: AlertData[];
}

export const MissionControl = ({ time, mission, casualtyCount, alerts }: MissionControlProps) => {
  const getMissionStatusIcon = (status: MissionData["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4 text-status-safe" />;
      case "planning":
        return <Pause className="w-4 h-4 text-status-caution" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-status-safe" />;
      case "aborted":
        return <X className="w-4 h-4 text-status-critical" />;
    }
  };

  const getElapsedTime = () => {
    const elapsed = Date.now() - mission.startTime.getTime();
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const criticalAlerts = alerts.filter(a => a.type === "emergency").length;
  const warningAlerts = alerts.filter(a => a.type === "warning").length;

  return (
    <div className="h-full tactical-panel flex items-center justify-between px-6">
      {/* Mission Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {getMissionStatusIcon(mission.status)}
          <div>
            <div className="text-lg font-bold text-primary">{mission.name}</div>
            <div className="text-xs text-muted-foreground">
              Elapsed: {getElapsedTime()}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">{mission.area}</div>
            <div className="text-xs text-muted-foreground">AO: {mission.area}</div>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-primary" />
            <div className="text-sm font-mono">{mission.weather}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <div className="text-sm font-mono">{mission.visibility}</div>
          </div>
        </div>
      </div>

      {/* System Clock */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-primary">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs text-muted-foreground">
              {time.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Casualty Counter */}
        <div className="text-center">
          <div className="text-2xl font-bold text-priority-high">{casualtyCount}</div>
          <div className="text-xs text-muted-foreground uppercase">Casualties</div>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Alert Summary */}
        <div className="flex items-center gap-3">
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-status-critical/20 rounded border border-status-critical/30">
              <AlertTriangle className="w-4 h-4 text-status-critical animate-alert-blink" />
              <span className="text-sm font-bold text-status-critical">{criticalAlerts}</span>
            </div>
          )}
          
          {warningAlerts > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-status-caution/20 rounded border border-status-caution/30">
              <AlertTriangle className="w-4 h-4 text-status-caution" />
              <span className="text-sm font-bold text-status-caution">{warningAlerts}</span>
            </div>
          )}

          {criticalAlerts === 0 && warningAlerts === 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-status-safe/20 rounded border border-status-safe/30">
              <CheckCircle2 className="w-4 h-4 text-status-safe" />
              <span className="text-xs text-status-safe">ALL SYSTEMS NOMINAL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};