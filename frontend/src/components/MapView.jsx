import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import apiService from '../services/api';
import { validateAndCorrectCoordinates, formatCoordinates } from '../utils/coordinateUtils';

const MapView = ({ locations }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxConfig, setMapboxConfig] = useState(null);
  const [configError, setConfigError] = useState(null);

  // Define helper functions first
  const getColor = useCallback((type) => {
    const colors = {
      venue: '#3B82F6',
      reception: '#10B981',
      mehndi: '#F59E0B',
      barat: '#EF4444',
      photography: '#8B5CF6',
      custom: '#6B7280'
    };
    return colors[type] || '#6B7280';
  }, []);

  const getColorClass = useCallback((type) => {
    const colorClasses = {
      venue: 'blue',
      reception: 'green',
      mehndi: 'yellow',
      barat: 'red',
      photography: 'purple',
      custom: 'gray'
    };
    return colorClasses[type] || 'gray';
  }, []);

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
      
      // Disable Mapbox analytics and telemetry
      if (window.mapboxgl.setRTLTextPlugin) {
        window.mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
      }
    }
    
    // Disable Mapbox analytics at the global level
    if (typeof window !== 'undefined') {
      // Store original methods
      const originalFetch = window.fetch;
      const originalXMLHttpRequest = window.XMLHttpRequest;
      
      // Create a no-op function for blocked requests
      const blockRequest = () => {
        const error = new Error('Analytics blocked');
        error.name = 'BlockedRequest';
        return Promise.reject(error);
      };
      
      // Override fetch with more comprehensive blocking
      window.fetch = function(url, options) {
        if (typeof url === 'string') {
          const blockedPatterns = [
            'events.mapbox.com',
            'api.mapbox.com/events',
            'telemetry',
            'analytics',
            'tracking',
            'metrics'
          ];
          
          if (blockedPatterns.some(pattern => url.includes(pattern))) {
            console.log('Blocked analytics request:', url);
            return blockRequest();
          }
        }
        return originalFetch.call(this, url, options);
      };
      
      // Override XMLHttpRequest with comprehensive blocking
      window.XMLHttpRequest = function() {
        const xhr = new originalXMLHttpRequest();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        xhr.open = function(method, url, ...args) {
          if (typeof url === 'string') {
            const blockedPatterns = [
              'events.mapbox.com',
              'api.mapbox.com/events',
              'telemetry',
              'analytics',
              'tracking',
              'metrics'
            ];
            
            if (blockedPatterns.some(pattern => url.includes(pattern))) {
              console.log('Blocked analytics XHR request:', url);
              // Store the blocked URL for reference
              this._blockedUrl = url;
              return;
            }
          }
          return originalOpen.call(this, method, url, ...args);
        };
        
        xhr.send = function(data) {
          if (this._blockedUrl) {
            console.log('Prevented sending blocked XHR request:', this._blockedUrl);
            return;
          }
          return originalSend.call(this, data);
        };
        
        return xhr;
      };
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
        const { lat, lng, isValid } = validateAndCorrectCoordinates(location.lat, location.lng);
        if (isValid) {
          bounds.extend([lng, lat]);
        }
      });
    }

    // Initialize map with enhanced settings and performance optimizations
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
      logoPosition: 'bottom-right',
      // Performance optimizations
      renderWorldCopies: false,
      maxZoom: 18,
      minZoom: 1,
      // Disable Mapbox analytics and telemetry
      transformRequest: (url, resourceType) => {
        if (url.includes('events.mapbox.com') || 
            url.includes('api.mapbox.com/events') ||
            url.includes('telemetry') ||
            url.includes('analytics')) {
          return null; // Block analytics requests
        }
        return { url };
      }
    });

    // Add basic controls without the problematic ones
    // Note: We're skipping NavigationControl and GeolocateControl to avoid passive event listener warnings
    // The map still has built-in zoom and pan functionality
    
    // Add a simple custom zoom control
    const zoomControl = document.createElement('div');
    zoomControl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    zoomControl.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 0 2px rgba(0,0,0,.1);
      display: flex;
      flex-direction: column;
    `;
    
    const zoomIn = document.createElement('button');
    zoomIn.innerHTML = '+';
    zoomIn.style.cssText = `
      width: 30px;
      height: 30px;
      border: none;
      background: white;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    `;
    zoomIn.onclick = () => map.current.zoomIn();
    
    const zoomOut = document.createElement('button');
    zoomOut.innerHTML = '−';
    zoomOut.style.cssText = `
      width: 30px;
      height: 30px;
      border: none;
      background: white;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
    `;
    zoomOut.onclick = () => map.current.zoomOut();
    
    zoomControl.appendChild(zoomIn);
    zoomControl.appendChild(zoomOut);
    mapContainer.current.appendChild(zoomControl);
    
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
      
      // Clean up custom zoom control
      const zoomControl = mapContainer.current?.querySelector('.mapboxgl-ctrl-group');
      if (zoomControl) {
        zoomControl.remove();
      }
      
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
      
      // Validate and normalize coordinates using utility function
      const { lat, lng, isValid, error, wasCorrected } = validateAndCorrectCoordinates(location.lat, location.lng);
      
      if (!isValid) {
        console.error(`Invalid coordinates for ${location.name}:`, error);
        return;
      }
      
      if (wasCorrected) {
        console.log(`Corrected coordinates for ${location.name}:`, lat, lng);
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
          <p class="text-xs text-gray-400">Coordinates: ${formatCoordinates(lat, lng)}</p>
        </div>
      `);

      // Create marker with enhanced features using corrected coordinates
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      // Add subtle pulse animation (highly optimized)
      let animationId;
      let lastFrameTime = 0;
      const frameInterval = 1000 / 15; // 15 FPS max for better performance
      let isAnimating = false;
      
      const animateMarker = (timestamp) => {
        if (!isAnimating) return;
        
        if (timestamp - lastFrameTime >= frameInterval) {
          const scale = 1.0 + Math.sin(timestamp / 3000) * 0.02; // Very subtle animation
        el.style.transform = `scale(${scale})`;
          lastFrameTime = timestamp;
        }
        animationId = requestAnimationFrame(animateMarker);
      };
      
      // Start animation after a delay and only if marker is still valid
      setTimeout(() => {
        if (marker && !marker.removed && map.current) {
          isAnimating = true;
        animationId = requestAnimationFrame(animateMarker);
        }
      }, 3000);
      
      // Stop animation when marker is removed
      const originalRemove = marker.remove;
      marker.remove = function() {
        isAnimating = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        return originalRemove.call(this);
      };

      // Store marker with animation ID for cleanup
      marker.animationId = animationId;
      markersRef.current.push(marker);
    });

    // Fly to locations with animation if we have them
    if (locations.length > 0) {
      setTimeout(() => {
        if (locations.length === 1) {
          // Single location - fly to it with enhanced animation
          const location = locations[0];
          const { lat, lng, isValid } = validateAndCorrectCoordinates(location.lat, location.lng);
          
          if (isValid) {
          map.current.flyTo({
              center: [lng, lat],
            zoom: 14,
            pitch: 45,
            bearing: 20,
            speed: 0.8,
            curve: 1.2,
            easing: function (t) { return t; }
          });
          }
        } else {
          // Multiple locations - fit bounds
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach(location => {
            const { lat, lng, isValid } = validateAndCorrectCoordinates(location.lat, location.lng);
            if (isValid) {
              bounds.extend([lng, lat]);
            }
          });
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }, 500);
    }
  }, [mapLoaded, locations, getColor, getColorClass]);

  // Memoize legend and location list components
  const legendComponent = useMemo(() => {
    if (!locations || locations.length === 0) return null;
    
    const locationTypes = ['venue', 'reception', 'mehndi', 'barat', 'photography', 'custom'];
    const typeCounts = locationTypes.reduce((acc, type) => {
      acc[type] = locations.filter(l => l.type === type).length;
      return acc;
    }, {});
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Location Types:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {locationTypes.map(type => {
            const count = typeCounts[type];
            if (count === 0) return null;
            
            return (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColor(type) }}
                />
                <span className="capitalize">{type} ({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [locations, getColor]);

  const locationListComponent = useMemo(() => {
    if (!locations || locations.length === 0) return null;
    
    return (
      <div className="mt-4 max-h-32 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Locations:</h4>
        <div className="space-y-1 text-xs">
          {locations.map((location, index) => {
            const { lat, lng, isValid } = validateAndCorrectCoordinates(location.lat, location.lng);
            return (
              <div key={location._id} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded">
                <span className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColor(location.type) }}
                  />
                  <span className="font-medium">{location.name}</span>
                </span>
                <span className="text-gray-500 text-xs">
                  {isValid ? formatCoordinates(lat, lng, 3) : 'Invalid coordinates'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [locations, getColor]);

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
      {legendComponent}
      
      {/* Location List */}
      {locationListComponent}
    </div>
  );
};

export default MapView;
