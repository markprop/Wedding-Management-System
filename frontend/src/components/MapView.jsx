import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import apiService from '../services/api';

const MapView = ({ locations }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxConfig, setMapboxConfig] = useState(null);
  const [configError, setConfigError] = useState(null);

  // Fetch Mapbox configuration from backend
  useEffect(() => {
    const fetchMapboxConfig = async () => {
      try {
        const config = await apiService.getMapboxConfig();
        setMapboxConfig(config);
      } catch (error) {
        console.error('Failed to fetch Mapbox configuration:', error);
        setConfigError(error.message);
      }
    };

    fetchMapboxConfig();
  }, []);

  // Disable Mapbox analytics to prevent blocking issues
  useEffect(() => {
    // Disable Mapbox analytics globally
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = mapboxConfig?.accessToken;
    }
  }, [mapboxConfig]);

  useEffect(() => {
    if (!mapboxConfig || !mapboxConfig.accessToken) {
      return;
    }

    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = mapboxConfig.accessToken;

    // Calculate bounds if we have locations
    let bounds = null;
    if (locations && locations.length > 0) {
      bounds = new mapboxgl.LngLatBounds();
      locations.forEach(location => {
        bounds.extend([location.lng, location.lat]);
      });
    }

    // Initialize map with enhanced settings
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxConfig.style || 'mapbox://styles/mapbox/streets-v12',
      center: bounds ? bounds.getCenter() : [67.0011, 24.8607], // Default to Karachi
      zoom: bounds ? 10 : 8,
      pitch: 0,
      bearing: 0,
      bounds: bounds,
      fitBoundsOptions: {
        padding: 50
      },
      // Disable analytics to prevent blocking issues
      attributionControl: false,
      logoPosition: 'bottom-right'
    });

    // Add enhanced controls
    map.current.addControl(new mapboxgl.NavigationControl({ 
      showCompass: true,
      showZoom: true
    }), 'top-right');
    
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: true
    }), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Handle errors
    map.current.on('error', function (e) {
      console.error('Map error:', e.error);
    });

    return () => {
      // Clean up animations
      markersRef.current.forEach(marker => {
        if (marker.animationId) {
          cancelAnimationFrame(marker.animationId);
        }
      });
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxConfig, locations]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !locations || locations.length === 0) return;

    // Clear existing markers and animations
    markersRef.current.forEach(marker => {
      if (marker.animationId) {
        cancelAnimationFrame(marker.animationId);
      }
      marker.remove();
    });
    markersRef.current = [];

    // Add markers for each location with enhanced features
    locations.forEach((location, index) => {
      // Debug coordinates
      console.log(`Location: ${location.name}, Lat: ${location.lat}, Lng: ${location.lng}`);
      
      // Validate coordinates
      if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
        console.error(`Invalid coordinates for ${location.name}:`, location.lat, location.lng);
        return;
      }
      
      // Check if coordinates are reasonable for Pakistan/Karachi area
      if (location.lat < 20 || location.lat > 40 || location.lng < 60 || location.lng > 80) {
        console.warn(`Coordinates for ${location.name} seem incorrect:`, location.lat, location.lng);
        console.warn('Expected range: Lat 20-40, Lng 60-80 (Pakistan area)');
      }
      
      const color = getColor(location.type);
      
      // Create custom marker element with enhanced styling
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      el.textContent = index + 1;

      // Add hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = 'auto';
      });

      // Create enhanced popup
      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-lg text-gray-800 mb-2">${location.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${location.address}</p>
          <div class="flex items-center space-x-2 mb-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getColorClass(location.type)}-100 text-${getColorClass(location.type)}-800">
              ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}
            </span>
          </div>
          <p class="text-xs text-gray-400">Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
        </div>
      `);

      // Create marker with enhanced features
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add subtle pulse animation (optimized)
      let animationId;
      const animateMarker = (timestamp) => {
        const scale = 1.0 + Math.sin(timestamp / 1000) * 0.05; // Slower, more subtle animation
        el.style.transform = `scale(${scale})`;
        animationId = requestAnimationFrame(animateMarker);
      };
      
      // Start animation after a delay to reduce initial load
      setTimeout(() => {
        animationId = requestAnimationFrame(animateMarker);
      }, 1000);

      // Store marker with animation ID for cleanup
      marker.animationId = animationId;
      markersRef.current.push(marker);
    });

    // Fly to locations with animation if we have them
    if (locations.length > 0) {
      setTimeout(() => {
        if (locations.length === 1) {
          // Single location - fly to it with enhanced animation
          map.current.flyTo({
            center: [locations[0].lng, locations[0].lat],
            zoom: 14,
            pitch: 45,
            bearing: 20,
            speed: 0.8,
            curve: 1.2,
            easing: function (t) { return t; }
          });
        } else {
          // Multiple locations - fit bounds
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach(location => {
            bounds.extend([location.lng, location.lat]);
          });
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }, 500);
    }
  }, [mapLoaded, locations]);

  const getColor = (type) => {
    const colors = {
      venue: '#3B82F6',
      reception: '#10B981',
      mehndi: '#F59E0B',
      barat: '#EF4444',
      photography: '#8B5CF6',
      custom: '#6B7280'
    };
    return colors[type] || '#6B7280';
  };

  const getColorClass = (type) => {
    const colorClasses = {
      venue: 'blue',
      reception: 'green',
      mehndi: 'yellow',
      barat: 'red',
      photography: 'purple',
      custom: 'gray'
    };
    return colorClasses[type] || 'gray';
  };

  if (configError) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-red-600 font-medium">Mapbox Configuration Error</p>
          <p className="text-sm">{configError}</p>
        </div>
      </div>
    );
  }

  if (!mapboxConfig) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-blue-600 font-medium">Loading Map Configuration...</p>
          <p className="text-sm">Please wait while we fetch the map settings</p>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No locations to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg border-2 border-gray-300 shadow-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Legend */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Location Types:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['venue', 'reception', 'mehndi', 'barat', 'photography', 'custom'].map(type => {
            const color = getColor(type);
            const count = locations.filter(l => l.type === type).length;
            if (count === 0) return null;
            
            return (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{type} ({count})</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Location List */}
      <div className="mt-4 max-h-32 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Locations:</h4>
        <div className="space-y-1 text-xs">
          {locations.map((location, index) => (
            <div key={location._id} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded">
              <span className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getColor(location.type) }}
                />
                <span className="font-medium">{location.name}</span>
              </span>
              <span className="text-gray-500 text-xs">
                {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
