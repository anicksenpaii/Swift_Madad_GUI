import { useState, useEffect } from "react";

export interface DroneData {
  id: string;
  callsign: string;
  status: "active" | "returning" | "emergency" | "offline";
  position: { lat: number; lng: number };
  altitude: number;
  battery: number;
  speed: number;
  heading: number;
  mission: string;
  lastUpdate: Date;
  flightTime: number;
  signalStrength: number;
}

export interface CasualtyData {
  id: string;
  position: { lat: number; lng: number };
  priority: "critical" | "urgent" | "delayed" | "deceased";
  discoveredBy: string;
  discoveredAt: Date;
  description: string;
  status: "unconfirmed" | "confirmed" | "evacuated";
}

export interface MissionData {
  id: string;
  name: string;
  status: "active" | "planning" | "completed" | "aborted";
  startTime: Date;
  area: string;
  weather: string;
  visibility: string;
}

export interface AlertData {
  id: string;
  type: "emergency" | "warning" | "info";
  message: string;
  timestamp: Date;
  droneId?: string;
  acknowledged: boolean;
}

export const useTacticalData = () => {
  const [drones, setDrones] = useState<DroneData[]>([
    {
      id: "D1",
      callsign: "HAWK-01",
      status: "active",
      position: { lat: 40.7589, lng: -73.9851 },
      altitude: 120,
      battery: 87,
      speed: 15,
      heading: 45,
      mission: "Search Grid A1-A4",
      lastUpdate: new Date(),
      flightTime: 1847,
      signalStrength: 95,
    },
    {
      id: "D2",
      callsign: "EAGLE-02",
      status: "active",
      position: { lat: 40.7614, lng: -73.9776 },
      altitude: 100,
      battery: 62,
      speed: 12,
      heading: 270,
      mission: "Casualty Investigation",
      lastUpdate: new Date(),
      flightTime: 2234,
      signalStrength: 78,
    },
    {
      id: "D3",
      callsign: "FALCON-03",
      status: "returning",
      position: { lat: 40.7505, lng: -73.9934 },
      altitude: 80,
      battery: 23,
      speed: 18,
      heading: 180,
      mission: "RTB - Low Battery",
      lastUpdate: new Date(),
      flightTime: 3156,
      signalStrength: 85,
    },
    {
      id: "D4",
      callsign: "RAVEN-04",
      status: "offline",
      position: { lat: 40.7485, lng: -73.9857 },
      altitude: 0,
      battery: 0,
      speed: 0,
      heading: 0,
      mission: "Maintenance",
      lastUpdate: new Date(Date.now() - 300000),
      flightTime: 0,
      signalStrength: 0,
    },
  ]);

  const [casualties, setCasualties] = useState<CasualtyData[]>([
    {
      id: "C1",
      position: { lat: 40.7598, lng: -73.9832 },
      priority: "critical",
      discoveredBy: "HAWK-01",
      discoveredAt: new Date(Date.now() - 1200000),
      description: "Adult male, visible injuries, movement detected",
      status: "confirmed",
    },
    {
      id: "C2",
      position: { lat: 40.7567, lng: -73.9789 },
      priority: "urgent",
      discoveredBy: "EAGLE-02",
      discoveredAt: new Date(Date.now() - 800000),
      description: "Possible trapped person under debris",
      status: "unconfirmed",
    },
    {
      id: "C3",
      position: { lat: 40.7612, lng: -73.9743 },
      priority: "delayed",
      discoveredBy: "HAWK-01",
      discoveredAt: new Date(Date.now() - 2400000),
      description: "Individual walking, appears mobile",
      status: "confirmed",
    },
  ]);

  const [mission] = useState<MissionData>({
    id: "M1",
    name: "URBAN RESCUE ALPHA",
    status: "active",
    startTime: new Date(Date.now() - 7200000),
    area: "Manhattan Financial District",
    weather: "Clear, 18°C, 5kt NE",
    visibility: "10km",
  });

  const [alerts, setAlerts] = useState<AlertData[]>([
    {
      id: "A1",
      type: "warning",
      message: "FALCON-03 low battery - RTB initiated",
      timestamp: new Date(Date.now() - 120000),
      droneId: "D3",
      acknowledged: false,
    },
    {
      id: "A2",
      type: "info",
      message: "New casualty confirmed by HAWK-01",
      timestamp: new Date(Date.now() - 300000),
      droneId: "D1",
      acknowledged: false,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prevDrones => 
        prevDrones.map(drone => ({
          ...drone,
          lastUpdate: new Date(),
          // Simulate minor position changes for active drones
          position: drone.status === "active" ? {
            lat: drone.position.lat + (Math.random() - 0.5) * 0.0001,
            lng: drone.position.lng + (Math.random() - 0.5) * 0.0001,
          } : drone.position,
          // Simulate battery drain
          battery: drone.status === "active" && drone.battery > 0 
            ? Math.max(0, drone.battery - Math.random() * 0.1) 
            : drone.battery,
          // Update flight time for active drones
          flightTime: drone.status === "active" 
            ? drone.flightTime + 1 
            : drone.flightTime,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { drones, casualties, mission, alerts, setAlerts };
};