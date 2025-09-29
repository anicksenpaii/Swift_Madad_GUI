// "use client";
// import React, { useState, useEffect } from 'react';
// import { Search, ChevronUp, Settings, Grid3X3, Info, BarChart3, Lock, Menu, Volume2, VolumeX, Maximize2,MapPin } from 'lucide-react';
// import MapComponent from './MapComponent'; // Import the live map component

// // Define the drone interface to match MapComponent
// interface DronePosition {
//   id: string;
//   lat: number;
//   lon: number;
//   hdg?: number;
//   color?: string;
// }

// export interface Casualty {
//   id: number;
//   status: 'green' | 'yellow' | 'red' | 'black';
// }

// const TacticalDashboard = () => {
//   const [currentTime, setCurrentTime] = useState('');
//   const [isMuted, setIsMuted] = useState(false);
  
//   // Updated state to support multiple drones
//   const [homePosition, setHomePosition] = useState<{ lat: number; lon: number; hdg?: number } | null>(null);
//   const [dronePositions, setDronePositions] = useState<DronePosition[]>([]);
  
//   // Optional: Keep single drone for backward compatibility
//   const [mainDrone, setMainDrone] = useState<DronePosition | null>(null);

//   const staticCasualties: Casualty[] = [
//     // 4 green
//     { id: 1, status: 'green' }, { id: 2, status: 'green' }, { id: 3, status: 'green' }, { id: 4, status: 'green' },
//     // 6 yellow
//     { id: 5, status: 'yellow' }, { id: 6, status: 'yellow' }, { id: 7, status: 'yellow' }, { id: 8, status: 'yellow' }, { id: 9, status: 'yellow' }, { id: 10, status: 'yellow' },
//     // 4 red
//     { id: 11, status: 'red' }, { id: 12, status: 'red' }, { id: 13, status: 'red' }, { id: 14, status: 'red' },
//     // 3 black
//     { id: 15, status: 'black' }, { id: 16, status: 'black' }, { id: 17, status: 'black' }
//   ];

//   // Effect for the updating clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date();
//       setCurrentTime(now.toLocaleTimeString('en-US', { 
//         hour12: false, 
//         hour: '2-digit', 
//         minute: '2-digit',
//       }));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Effect to connect to the WebSocket bridge and receive telemetry
//   useEffect(() => {
//     const ws = new WebSocket('ws://localhost:8765');

//     ws.onopen = () => {
//       console.log('Connected to telemetry server');
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         if (data.type === 'home') {
//           console.log('Received home position:', data);
//           setHomePosition({ lat: data.lat, lon: data.lon, hdg: data.hdg ?? 0 });
//         } 
//         else if (data.type === 'telemetry') {
//           // Handle single drone (backward compatibility)
//           const droneData: DronePosition = {
//             id: data.id || 'main-drone',
//             lat: data.lat,
//             lon: data.lon,
//             hdg: data.hdg ?? 0,
//             color: data.color // Optional color from websocket
//           };
          
//           setMainDrone(droneData);
//           console.log('Received drone telemetry:', droneData);
//         }
//         else if (data.type === 'multi-telemetry') {
//           // Handle multiple drones
//           if (Array.isArray(data.drones)) {
//             const updatedDrones: DronePosition[] = data.drones.map((drone: any, index: number) => ({
//               id: drone.id || `drone-${index}`,
//               lat: drone.lat,
//               lon: drone.lon,
//               hdg: drone.hdg ?? 0,
//               color: drone.color // Will auto-assign if not provided
//             }));
            
//             setDronePositions(updatedDrones);
//             console.log('Received multi-drone telemetry:', updatedDrones);
//           }
//         }
//         else if (data.type === 'drone-update') {
//           // Update individual drone in the fleet
//           setDronePositions(prevDrones => {
//             const existingIndex = prevDrones.findIndex(d => d.id === data.id);
//             const updatedDrone: DronePosition = {
//               id: data.id,
//               lat: data.lat,
//               lon: data.lon,
//               hdg: data.hdg ?? 0,
//               color: data.color
//             };
            
//             if (existingIndex >= 0) {
//               // Update existing drone
//               const newDrones = [...prevDrones];
//               newDrones[existingIndex] = updatedDrone;
//               return newDrones;
//             } else {
//               // Add new drone
//               return [...prevDrones, updatedDrone];
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Failed to parse websocket message:", error);
//       }
//     };

//     ws.onclose = () => {
//       console.log('Disconnected from telemetry server');
//     };

//     ws.onerror = (error) => {
//         console.error('WebSocket Error:', error);
//     };

//     // Cleanup on component unmount
//     return () => {
//       ws.close();
//     };
//   }, []); // Empty dependency array ensures this runs only once

//   return (
//     <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden flex flex-col">
//       {/* Top Navigation */}
//       <div className="h-12 bg-black bg-opacity-50 flex items-center justify-between px-4 z-50 flex-shrink-0">
//         <div className="flex items-center space-x-4">
//           <Menu className="w-5 h-5" />
//           <span className="font-mono text-sm">{currentTime}</span>
//         </div>
        
//         {/* --- NEW: Casualty Counter Component --- */}
//         <div className="flex items-center space-x-4 font-mono text-sm">
//           <span>CASUALTIES DETECTED: 17</span>
//           <div className="flex items-center space-x-2">
//             <MapPin className="w-4 h-4 text-green-500" /><span>4</span>
//             <MapPin className="w-4 h-4 text-yellow-500" /><span>6</span>
//             <MapPin className="w-4 h-4 text-red-500" /><span>4</span>
//             <MapPin className="w-4 h-4 text-gray-500" /><span>3</span>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <Search className="w-5 h-5" />
//           <ChevronUp className="w-5 h-5" />
//           <Settings className="w-5 h-5" />
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Left Sidebar */}
//         <div className="w-85 bg-black bg-opacity-30 flex flex-col flex-shrink-0">
//           <div className="flex-1 space-y-4 p-2">
            
//             {/* --- THIS IS THE NEW CAMERA FEED SECTION --- */}
//             <div className="text-center">
//               <img 
//                 src="/drone1_feed.jpg" 
//                 alt="Drone 1 Camera Feed" 
//                 className="w-full h-50 object-cover rounded border-2 border-yellow-500"
//               />
//               <p className="text-xs font-mono text-yellow-400 mt-1">Drone1_camera_feed</p>
//             </div>
            
//             {/* Placeholder for a second camera feed */}
//             <div className="text-center">
//                 <img 
//                   src="/traversable_path.png" 
//                   alt="Drone 2 Camera Feed" 
//                   className="w-full h-50 object-cover rounded border-2 border-green-500"
//                 />
//               <p className="text-xs font-mono text-gray-400 mt-1">Traversable_Path</p>
//             </div>

//           </div>
//           <div className="p-2">
//             <div className="bg-green-600 px-2 py-1 text-xs text-center rounded">
//               DRONE FEED
//             </div>
//             {/* Show drone count */}
//             <div className="text-xs text-green-400 text-center mt-1">
//               {dronePositions.length > 0 ? `${dronePositions.length} DRONES` : mainDrone ? '1 DRONE' : 'NO DRONES'}
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 relative">
//           {/* Pass both single drone and multiple drones to MapComponent */}
//           <MapComponent 
//             homePosition={homePosition} 
//             dronePosition={mainDrone}
//             dronePositions={dronePositions.length > 0 ? dronePositions : undefined}
//             casualties={staticCasualties}
//           />
//         </div>

//         {/* Right Sidebar */}
//         <div className="w-12 bg-black bg-opacity-30 flex flex-col items-center justify-between py-4 flex-shrink-0">
//           <div className="space-y-4">
//             <Search className="w-6 h-6 text-gray-400" />
//             <Grid3X3 className="w-6 h-6 text-gray-400" />
//             <div className="w-6 h-6 bg-white rounded-full"></div>
//             <Info className="w-6 h-6 text-gray-400" />
//             <div className="w-6 h-6 bg-gray-600 rounded"></div>
//             <span className="text-xs font-mono rotate-90 whitespace-nowrap">V</span>
//             <Settings className="w-6 h-6 text-gray-400" />
//             <BarChart3 className="w-6 h-6 text-gray-400" />
//           </div>
//           <div className="space-y-4">
//             <Lock className="w-6 h-6 text-red-500" />
//             <div className="w-6 h-6 bg-gray-600 rounded"></div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Control Bar */}
//       <div className="h-16 bg-black bg-opacity-50 flex items-center justify-between px-4 z-50 flex-shrink-0">
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={() => setIsMuted(!isMuted)}
//             className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
//             {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
//           </button>
//           <Volume2 className="w-5 h-5 text-gray-400" />
//           <Volume2 className="w-5 h-5 text-gray-400" />
//           <Maximize2 className="w-5 h-5 text-gray-400" />
//         </div>
        
//         <div className="flex-1 mx-8">
//           <div className="bg-gray-800 px-4 py-2 rounded text-sm text-gray-300">
//             FREE COMMENT HERE
//           </div>
//         </div>
        
//         <div className="bg-red-600 px-6 py-2 rounded text-sm font-semibold">
//           BREAKAWAY ALERT
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TacticalDashboard;

import { useState, useEffect } from "react";
import { TacticalMap } from "@/components/TacticalMap";
import { DronePanel } from "@/components/DronePanel";
import { MissionControl } from "@/components/MissionControl";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { ActionBar } from "@/components/ActionBar";
import { AlertPanel } from "@/components/AlertPanel";
import MapComponent from "@/components/MapComponent";

// Define the drone interface to match MapComponent
interface DronePosition {
  id: string;
  lat: number;
  lon: number;
  hdg?: number;
  color?: string;
}

export interface Casualty {
  id: number;
  status: 'green' | 'yellow' | 'red' | 'black';
}

const Index = () => {
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  
  // WebSocket drone data
  const [homePosition, setHomePosition] = useState<{ lat: number; lon: number; hdg?: number } | null>(null);
  const [dronePositions, setDronePositions] = useState<DronePosition[]>([]);
  const [mainDrone, setMainDrone] = useState<DronePosition | null>(null);

  // Static casualties data (from your original code)
  const casualties: Casualty[] = [
    // 4 green
    { id: 1, status: 'green' }, { id: 2, status: 'green' }, { id: 3, status: 'green' }, { id: 4, status: 'green' },
    // 6 yellow
    { id: 5, status: 'yellow' }, { id: 6, status: 'yellow' }, { id: 7, status: 'yellow' }, { id: 8, status: 'yellow' }, { id: 9, status: 'yellow' }, { id: 10, status: 'yellow' },
    // 4 red
    { id: 11, status: 'red' }, { id: 12, status: 'red' }, { id: 13, status: 'red' }, { id: 14, status: 'red' },
    // 3 black
    { id: 15, status: 'black' }, { id: 16, status: 'black' }, { id: 17, status: 'black' }
  ];

  // Mission data
  const mission = {
    id: "M1",
    name: "URBAN RESCUE ALPHA",
    status: "active" as const,
    startTime: new Date(Date.now() - 7200000),
    area: "Manhattan Financial District",
    weather: "Clear, 18°C, 5kt NE",
    visibility: "10km",
  };

  // Alert data
  const [alerts] = useState([
    {
      id: "A1",
      type: "warning" as const,
      message: "WebSocket telemetry active - monitoring drones",
      timestamp: new Date(),
      acknowledged: false,
    },
  ]);

  // Update system time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket connection for real-time telemetry
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      console.log('Connected to telemetry server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'home') {
          console.log('Received home position:', data);
          setHomePosition({ lat: data.lat, lon: data.lon, hdg: data.hdg ?? 0 });
        } 
        else if (data.type === 'telemetry') {
          // Handle single drone (backward compatibility)
          const droneData: DronePosition = {
            id: data.id || 'main-drone',
            lat: data.lat,
            lon: data.lon,
            hdg: data.hdg ?? 0,
            color: data.color // Optional color from websocket
          };
          
          setMainDrone(droneData);
          console.log('Received drone telemetry:', droneData);
        }
        else if (data.type === 'multi-telemetry') {
          // Handle multiple drones
          if (Array.isArray(data.drones)) {
            const updatedDrones: DronePosition[] = data.drones.map((drone: any, index: number) => ({
              id: drone.id || `drone-${index}`,
              lat: drone.lat,
              lon: drone.lon,
              hdg: drone.hdg ?? 0,
              color: drone.color // Will auto-assign if not provided
            }));
            
            setDronePositions(updatedDrones);
            console.log('Received multi-drone telemetry:', updatedDrones);
          }
        }
        else if (data.type === 'drone-update') {
          // Update individual drone in the fleet
          setDronePositions(prevDrones => {
            const existingIndex = prevDrones.findIndex(d => d.id === data.id);
            const updatedDrone: DronePosition = {
              id: data.id,
              lat: data.lat,
              lon: data.lon,
              hdg: data.hdg ?? 0,
              color: data.color
            };
            
            if (existingIndex >= 0) {
              // Update existing drone
              const newDrones = [...prevDrones];
              newDrones[existingIndex] = updatedDrone;
              return newDrones;
            } else {
              // Add new drone
              return [...prevDrones, updatedDrone];
            }
          });
        }
      } catch (error) {
        console.error("Failed to parse websocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from telemetry server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Top Mission Control Bar */}
      <div className="h-16 border-b border-border">
        <MissionControl 
          time={time}
          mission={mission}
          casualtyCount={casualties.length}
          alerts={alerts}
        />
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Camera Feed Panel */}
        <div className="w-80 border-r border-border">
          <TelemetryPanel 
            dronePositions={dronePositions}
            mainDrone={mainDrone}
            selectedDrone={selectedDrone}
            onSelectDrone={setSelectedDrone}
          />
        </div>

        {/* Center Map Interface */}
        <div className="flex-1 relative">
          <MapComponent 
            homePosition={homePosition} 
            dronePosition={mainDrone}
            dronePositions={dronePositions.length > 0 ? dronePositions : undefined}
            casualties={casualties}
          />
          
          {/* Overlay Alert Panel */}
          {alerts.length > 0 && (
            <div className="absolute top-4 right-4 w-80">
              <AlertPanel alerts={alerts} />
            </div>
          )}
        </div>

        {/* Right Drone Management Panel */}
        <div className="w-80 border-l border-border">
          <DronePanel 
            dronePositions={dronePositions}
            mainDrone={mainDrone}
            selectedDrone={selectedDrone}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-20 border-t border-border">
        <ActionBar 
          selectedDrone={selectedDrone}
          emergencyMode={false}
        />
      </div>
    </div>
  );
};

export default Index;

