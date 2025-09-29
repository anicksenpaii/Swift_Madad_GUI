import { AlertTriangle, Info, X, CheckCircle2 } from "lucide-react";
import { AlertData } from "@/hooks/useTacticalData";
import { Button } from "@/components/ui/button";
import React from "react"; // ✅ Needed because you're using JSX

interface AlertPanelProps {
  alerts: AlertData[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: AlertData["type"]) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-4 h-4 text-status-critical" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-status-caution" />;
      case "info":
        return <Info className="w-4 h-4 text-primary" />;
      default:
        return null; // ✅ avoids TS error: not all cases return
    }
  };

  const getAlertStyle = (type: AlertData["type"]) => {
    switch (type) {
      case "emergency":
        return "border-status-critical bg-status-critical/10 animate-alert-blink";
      case "warning":
        return "border-status-caution bg-status-caution/10";
      case "info":
        return "border-primary/50 bg-primary/5";
      default:
        return ""; // ✅ same fix here
    }
  };

  const handleAcknowledge = (alertId: string) => {
    console.log("Acknowledging alert:", alertId);
    // Alert acknowledgment implementation
  };

  const handleDismiss = (alertId: string) => {
    console.log("Dismissing alert:", alertId);
    // Alert dismissal implementation
  };

  if (alerts.length === 0) return null;

  return (
    <div className="tactical-panel">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          ALERTS ({alerts.length})
        </h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 border-b border-border/50 ${getAlertStyle(alert.type)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    {alert.message}
                  </div>
                  {alert.droneId && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Source: {alert.droneId}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {/* ✅ Ensure timestamp is Date or cast before toLocaleTimeString */}
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {!alert.acknowledged && (
                  <Button
                    className="tactical-button h-6 px-2 text-xs border border-border bg-transparent"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </Button>
                )}

                <Button
                  className="tactical-button h-6 px-2 text-xs border border-border bg-transparent"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {alert.acknowledged && (
              <div className="mt-2 flex items-center gap-1 text-xs text-status-safe">
                <CheckCircle2 className="w-3 h-3" />
                ACKNOWLEDGED
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <Button
          className="tactical-button w-full h-7 text-xs border border-border bg-transparent"
          onClick={() => alerts.forEach((alert) => handleAcknowledge(alert.id))}
        >
          ACKNOWLEDGE ALL
        </Button>
      </div>
    </div>
  );
};
