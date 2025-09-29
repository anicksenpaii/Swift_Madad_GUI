
// "use client";
// import React, { useRef, useEffect } from 'react';
// import maplibregl, { Map } from 'maplibre-gl';
// import * as turf from '@turf/turf';
// // Import the standard Feature and Point types from 'geojson'
// import { Feature, Point } from 'geojson';

// interface DronePosition {
//   id: string;
//   lat: number;
//   lon: number;
//   color?: string; // Optional color for each drone
// }

// interface MapComponentProps {
//   homePosition: { lat: number; lon: number } | null;
//   dronePosition: DronePosition | null; // Single drone (for backward compatibility)
//   dronePositions?: DronePosition[] | null; // Multiple drones
// }

// const MapComponent: React.FC<MapComponentProps> = ({ homePosition, dronePosition, dronePositions }) => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<Map | null>(null);
//   const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';
//   if (!maptilerKey) {
//     console.warn("NEXT_PUBLIC_MAPTILER_KEY is missing — map will not load.");
//     return;
// }

//   // Predefined colors for multiple drones
//   const droneColors = [
//     '#ffaa00', // Orange (default)
//     '#ff4444', // Red
//     '#44ff44', // Green
//     '#4444ff', // Blue
//     '#ff44ff', // Magenta
//     '#44ffff', // Cyan
//     '#ffff44', // Yellow
//     '#ff8844', // Orange-Red
//     '#8844ff', // Purple
//     '#44ff88'  // Light Green
//   ];

//   // Function to create SVG data URLs from SVG strings
//   const createSVGDataURL = (svgString: string, color: string) => {
//     const coloredSVG = svgString
//       .replace(/stroke="currentColor"/g, `stroke="${color}"`)
//       .replace(/fill="none"/g, `fill="${color}" fill-opacity="0.3"`);
//     return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coloredSVG);
//   };

//   // Function to get all drones (single + multiple)
//   const getAllDrones = (): DronePosition[] => {
//     const drones: DronePosition[] = [];
    
//     // Add single drone (backward compatibility)
//     if (dronePosition) {
//       drones.push({
//         id: 'drone-main',
//         lat: dronePosition.lat,
//         lon: dronePosition.lon,
//         color: dronePosition.color || droneColors[0]
//       });
//     }
    
//     // Add multiple drones
//     if (dronePositions && Array.isArray(dronePositions)) {
//       dronePositions.forEach((drone, index) => {
//         drones.push({
//           ...drone,
//           color: drone.color || droneColors[(index + 1) % droneColors.length]
//         });
//       });
//     }
    
//     return drones;
//   };

//   // SVG strings for our icons
//   const droneSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10 7 7"/><path d="m10 14-3 3"/><path d="m14 10 3-3"/><path d="m14 14 3 3"/><path d="M14.205 4.139a4 4 0 1 1 5.439 5.863"/><path d="M19.637 14a4 4 0 1 1-5.432 5.868"/><path d="M4.367 10a4 4 0 1 1 5.438-5.862"/><path d="M9.795 19.862a4 4 0 1 1-5.429-5.873"/><rect x="10" y="8" width="4" height="8" rx="1"/></svg>`;

//   const homeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M14 9h-4"/><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/></svg>`;

//   // Setup icon loading using MapLibre's styleimagemissing event
//   const setupIconLoading = () => {
//     if (!map.current) return;

//     const existingImages: { [key: string]: boolean } = {};
    
//     // Create icon map with home + all possible drone colors
//     const iconMap: { [key: string]: string } = {
//       'home-icon': createSVGDataURL(homeSVG, '#00ff00')
//     };
    
//     // Add drone icons for all colors
//     droneColors.forEach((color, index) => {
//       iconMap[`drone-icon-${index}`] = createSVGDataURL(droneSVG, color);
//     });

//     map.current.on('styleimagemissing', async (e) => {
//       if (existingImages[e.id] || !iconMap[e.id]) {
//         return;
//       }
      
//       existingImages[e.id] = true;
      
//       try {
//         const svgDataURL = iconMap[e.id];
//         const image = new Image();
        
//         const promise = new Promise((resolve) => {
//           image.onload = resolve;
//         });
        
//         image.src = svgDataURL;
//         await promise; // Wait for the image to load
        
//         map.current!.addImage(e.id, image);
//         console.log(`✅ ${e.id} loaded successfully via styleimagemissing`);
//       } catch (error) {
//         console.error(`❌ Failed to load ${e.id}:`, error);
//       }
//     });
//   };

//   // Effect to initialize the map
//   useEffect(() => {
//     if (map.current || !mapContainer.current || !maptilerKey) return;

//     const styleUrl = `https://api.maptiler.com/maps/satellite/style.json?key=${maptilerKey}`;

//     map.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: styleUrl,
//       center: [-74.5, 40],
//       zoom: 2,
//     });

//     map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

//     // Setup icon loading using the official MapLibre approach
//     map.current.on('load', setupIconLoading);

//   }, [maptilerKey]);

  

//   // Effect to handle the home position
//   useEffect(() => {
//     if (!homePosition || !map.current) return;

//     const handleStyleLoadForHome = () => {
//       if (!map.current) return;

//       map.current.flyTo({
//         center: [homePosition.lon, homePosition.lat],
//         zoom: 17, // 🚀 INCREASED ZOOM LEVEL (was 14, now 18 for much closer view)
//         speed: 1.5,
//       });

//       const center = [homePosition.lon, homePosition.lat];
//       const radius = 5;
//       const options = { steps: 64, units: 'kilometers' as const };
//       const circle = turf.circle(center, radius, options);

//       if (!map.current.getSource('geofence')) {
//         map.current.addSource('geofence', { type: 'geojson', data: circle });
//         map.current.addLayer({
//           id: 'geofence-layer',
//           type: 'fill',
//           source: 'geofence',
//           paint: { 'fill-color': '#007cbf', 'fill-opacity': 0.3 },
//         });
//       }

//       // Add home marker - FIXED VERSION
//       const homeGeoJSON: Feature<Point> = {
//         type: 'Feature',
//         geometry: { type: 'Point', coordinates: [homePosition.lon, homePosition.lat] },
//         properties: {},
//       };

//       if (!map.current.getSource('home')) {
//         console.log('Adding home source and layer...');
//         map.current.addSource('home', { type: 'geojson', data: homeGeoJSON });
//         map.current.addLayer({
//           id: 'home-layer',
//           type: 'symbol',
//           source: 'home',
//           layout: {
//             'icon-image': 'home-icon',
//             'icon-allow-overlap': true,
//             'icon-size': 0.8
//           }
//         });
//         console.log('✅ Home layer added');
//       } else {
//         // Update existing source
//         const source = map.current.getSource('home') as maplibregl.GeoJSONSource;
//         source.setData(homeGeoJSON);
//       }
//     };

//     if (map.current.isStyleLoaded()) {
//       handleStyleLoadForHome();
//     } else {
//       map.current.on('load', handleStyleLoadForHome);
//     }

//   }, [homePosition]);

//   // Effect to handle live drone position
//   useEffect(() => {
//     if (!dronePosition || !map.current || !map.current.isStyleLoaded()) return;

//     // THIS IS THE CORRECTED LINE USING THE 'geojson' TYPES
//     const droneGeoJSON: Feature<Point> = {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [dronePosition.lon, dronePosition.lat],
//       },
//       properties: {},
//     };

//     const source = map.current.getSource('drone') as maplibregl.GeoJSONSource;
//     if (source) {
//       source.setData(droneGeoJSON);
//     } else {
//       console.log('Adding drone source and layer...');
//       map.current.addSource('drone', { type: 'geojson', data: droneGeoJSON });
//       map.current.addLayer({
//         id: 'drone-layer',
//         type: 'symbol',
//         source: 'drone',
//         layout: {
//           'icon-image': 'drone-icon-0',
//           'icon-allow-overlap': true,
//           'icon-size': 0.8
//         }
//       });
//       console.log('✅ Drone layer added');
//     }
//   }, [dronePosition]);

//   return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
// };

// export default MapComponent;

"use client";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import * as turf from '@turf/turf';
// Import the standard Feature and Point types from 'geojson'
import { Feature, Point } from 'geojson';

// --- Interface for a single casualty ---
export interface Casualty {
  id: number;
  status: 'green' | 'yellow' | 'red' | 'black';
}

interface DronePosition {
  id: string;
  lat: number;
  lon: number;
  hdg?: number; // Added for rotation
  color?: string; // Optional color for each drone
}

// --- Add casualties to the props interface ---
interface MapComponentProps {
  homePosition: { lat: number; lon: number } | null;
  dronePosition: DronePosition | null; // Single drone (for backward compatibility)
  dronePositions?: DronePosition[] | null; // Multiple drones
  casualties: Casualty[] | null; // Add casualties
}

interface LocatedCasualty extends Casualty {
    lat: number;
    lon: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ homePosition, dronePosition, dronePositions, casualties }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';

  // --- Refs to store HTML Marker objects for casualties only ---
  const casualtyMarkersRef = useRef<{ [id: number]: Marker }>({});

  const [locatedCasualties, setLocatedCasualties] = useState<LocatedCasualty[]>([]);

  if (!maptilerKey) {
    console.warn("NEXT_PUBLIC_MAPTILER_KEY is missing — map will not load.");
    return null;
  }

  // Predefined colors for multiple drones
  const droneColors = [
    '#ffaa00', // Orange (default)
    '#ff4444', // Red
    '#44ff44', // Green
    '#4444ff', // Blue
    '#ff44ff', // Magenta
    '#44ffff', // Cyan
    '#ffff44', // Yellow
    '#ff8844', // Orange-Red
    '#8844ff', // Purple
    '#44ff88'  // Light Green
  ];

  // Function to create SVG data URLs from SVG strings
  const createSVGDataURL = (svgString: string, color: string) => {
    const coloredSVG = svgString
      .replace(/stroke="currentColor"/g, `stroke="${color}"`)
      .replace(/fill="none"/g, `fill="${color}" fill-opacity="0.3"`);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coloredSVG);
  };

  // Function to get all drones (single + multiple)
  const getAllDrones = (): (DronePosition & {hdg: number})[] => {
    const drones: (DronePosition & {hdg: number})[] = [];
    
    // Add single drone (backward compatibility)
    if (dronePosition) {
      drones.push({
        id: 'drone-main',
        lat: dronePosition.lat,
        lon: dronePosition.lon,
        hdg: dronePosition.hdg || 0,
        color: dronePosition.color || droneColors[0]
      });
    }
    
    // Add multiple drones
    if (dronePositions && Array.isArray(dronePositions)) {
      dronePositions.forEach((drone, index) => {
        drones.push({
          ...drone,
          hdg: drone.hdg || 0,
          color: drone.color || droneColors[(index + 1) % droneColors.length]
        });
      });
    }
    
    return drones;
  };

  // SVG strings for our icons
  const droneSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10 7 7"/><path d="m10 14-3 3"/><path d="m14 10 3-3"/><path d="m14 14 3 3"/><path d="M14.205 4.139a4 4 0 1 1 5.439 5.863"/><path d="M19.637 14a4 4 0 1 1-5.432 5.868"/><path d="M4.367 10a4 4 0 1 1 5.438-5.862"/><path d="M9.795 19.862a4 4 0 1 1-5.429-5.873"/><rect x="10" y="8" width="4" height="8" rx="1"/></svg>`;

  const homeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M14 9h-4"/><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/></svg>`;

  // Setup icon loading using MapLibre's styleimagemissing event
  const setupIconLoading = () => {
    if (!map.current) return;

    const existingImages: { [key: string]: boolean } = {};
    
    // Create icon map with home + all possible drone colors
    const iconMap: { [key: string]: string } = {
      'home-icon': createSVGDataURL(homeSVG, '#00ff00')
    };
    
    // Add drone icons for all colors
    droneColors.forEach((color, index) => {
      iconMap[`drone-icon-${index}`] = createSVGDataURL(droneSVG, color);
    });

    map.current.on('styleimagemissing', async (e) => {
      if (existingImages[e.id] || !iconMap[e.id]) {
        return;
      }
      
      existingImages[e.id] = true;
      
      try {
        const svgDataURL = iconMap[e.id];
        const image = new Image();
        
        const promise = new Promise((resolve) => {
          image.onload = resolve;
        });
        
        image.src = svgDataURL;
        await promise; // Wait for the image to load
        
        map.current!.addImage(e.id, image);
        console.log(`✅ ${e.id} loaded successfully via styleimagemissing`);
      } catch (error) {
        console.error(`❌ Failed to load ${e.id}:`, error);
      }
    });
  };

  // Effect to initialize the map
  useEffect(() => {
    if (map.current || !mapContainer.current || !maptilerKey) return;

    const styleUrl = `https://api.maptiler.com/maps/satellite/style.json?key=${maptilerKey}`;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [-74.5, 40],
      zoom: 2,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Setup icon loading using the official MapLibre approach
    map.current.on('load', setupIconLoading);

  }, [maptilerKey]);

  // Effect to generate random casualty locations
  useEffect(() => {
    if (!homePosition || !casualties || locatedCasualties.length > 0) return;
    
    const homePoint = turf.point([homePosition.lon, homePosition.lat]);
    const generatedCasualties: LocatedCasualty[] = casualties.map(cas => {
      const distance = Math.random() * 4 + 0.5; // 0.5 to 4.5 km from home
      const bearing = Math.random() * 360;
      const destination = turf.destination(homePoint, distance, bearing);
      return { 
        ...cas, 
        lon: destination.geometry.coordinates[0], 
        lat: destination.geometry.coordinates[1] 
      };
    });
    
    setLocatedCasualties(generatedCasualties);
    console.log('✅ Generated casualty locations:', generatedCasualties.length);
  }, [homePosition, casualties, locatedCasualties]);

  // Effect to handle the home position
  useEffect(() => {
    if (!homePosition || !map.current) return;

    const handleStyleLoadForHome = () => {
      if (!map.current) return;

      map.current.flyTo({
        center: [homePosition.lon, homePosition.lat],
        zoom: 17, // INCREASED ZOOM LEVEL
        speed: 1.5,
      });

      const center = [homePosition.lon, homePosition.lat];
      const radius = 5;
      const options = { steps: 64, units: 'kilometers' as const };
      const circle = turf.circle(center, radius, options);

      if (!map.current.getSource('geofence')) {
        map.current.addSource('geofence', { type: 'geojson', data: circle });
        map.current.addLayer({
          id: 'geofence-layer',
          type: 'fill',
          source: 'geofence',
          paint: { 'fill-color': '#007cbf', 'fill-opacity': 0.3 },
        });
      }

      // Add home marker using SVG icon system
      const homeGeoJSON: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [homePosition.lon, homePosition.lat] },
        properties: {},
      };

      if (!map.current.getSource('home')) {
        console.log('Adding home source and layer...');
        map.current.addSource('home', { type: 'geojson', data: homeGeoJSON });
        map.current.addLayer({
          id: 'home-layer',
          type: 'symbol',
          source: 'home',
          layout: {
            'icon-image': 'home-icon',
            'icon-allow-overlap': true,
            'icon-size': 0.8
          }
        });
        console.log('✅ Home layer added');
      } else {
        // Update existing source
        const source = map.current.getSource('home') as maplibregl.GeoJSONSource;
        source.setData(homeGeoJSON);
      }
    };

    if (map.current.isStyleLoaded()) {
      handleStyleLoadForHome();
    } else {
      map.current.on('load', handleStyleLoadForHome);
    }

  }, [homePosition]);

  // Effect to handle multiple drone positions using SVG icon system
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const allDrones = getAllDrones();

    // Handle multiple drones using GeoJSON sources and layers
    allDrones.forEach((drone, index) => {
      const sourceId = `drone-${drone.id}`;
      const layerId = `drone-layer-${drone.id}`;

      const droneGeoJSON: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [drone.lon, drone.lat],
        },
        properties: {},
      };

      const source = map.current!.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source) {
        // Update existing drone position
        source.setData(droneGeoJSON);
      } else {
        // Add new drone
        console.log(`Adding drone source and layer for ${drone.id}...`);
        map.current!.addSource(sourceId, { type: 'geojson', data: droneGeoJSON });
        
        // Use the appropriate color index for the icon
        const colorIndex = droneColors.findIndex(color => color === drone.color) || 0;
        
        map.current!.addLayer({
          id: layerId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'icon-image': `drone-icon-${colorIndex}`,
            'icon-allow-overlap': true,
            'icon-size': 0.8,
            'icon-rotate': drone.hdg || 0 // Apply rotation
          }
        });
        console.log(`✅ Drone layer added for ${drone.id}`);
      }

      // Update rotation for existing layers
      if (map.current!.getLayer(layerId)) {
        map.current!.setLayoutProperty(layerId, 'icon-rotate', drone.hdg || 0);
      }
    });

  }, [dronePosition, dronePositions]);

  // Effect to display casualty markers using PNG with HTML markers
  useEffect(() => {
    if (locatedCasualties.length === 0 || !map.current) return;
    
    const casualtyColors = { 
      green: '#22c55e', 
      yellow: '#eab308', 
      red: '#ef4444', 
      black: '#6b7280' 
    };

    locatedCasualties.forEach(cas => {
      if (casualtyMarkersRef.current[cas.id]) return; // Skip if already exists

      // Create HTML element for casualty marker
      const el = document.createElement('div');
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url(/icons/pin.png)';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.position = 'relative';
      el.style.cursor = 'pointer';

      // Add colored dot to indicate casualty status
      const dot = document.createElement('div');
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = casualtyColors[cas.status];
      dot.style.border = '1px solid white';
      dot.style.position = 'absolute';
      dot.style.top = '6px';
      dot.style.left = '12px';
      
      el.appendChild(dot);
      
      // Create MapLibre HTML marker
      const marker = new maplibregl.Marker(el)
        .setLngLat([cas.lon, cas.lat])
        .addTo(map.current!);
        
      // Store marker reference
      casualtyMarkersRef.current[cas.id] = marker;
      
      console.log(`✅ Casualty marker created for ID ${cas.id} with status ${cas.status}`);
    });
  }, [locatedCasualties]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up casualty markers when component unmounts
      Object.values(casualtyMarkersRef.current).forEach(marker => marker.remove());
    };
  }, []);

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
};

export default MapComponent;