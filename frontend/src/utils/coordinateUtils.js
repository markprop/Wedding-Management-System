/**
 * Utility functions for handling map coordinates
 */

/**
 * Validates and corrects coordinates for Pakistan/Karachi area
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {Object} - Corrected coordinates {lat, lng, isValid}
 */
export const validateAndCorrectCoordinates = (lat, lng) => {
  // Parse coordinates
  let parsedLat = parseFloat(lat);
  let parsedLng = parseFloat(lng);
  
  // Check if coordinates are valid numbers
  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return {
      lat: null,
      lng: null,
      isValid: false,
      error: 'Invalid coordinate format'
    };
  }
  
  // Check if coordinates are within valid ranges
  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    return {
      lat: null,
      lng: null,
      isValid: false,
      error: 'Coordinates out of valid range'
    };
  }
  
  // Check if coordinates are reasonable for Pakistan/Karachi area
  const isInPakistanRange = parsedLat >= 20 && parsedLat <= 40 && parsedLng >= 60 && parsedLng <= 80;
  
  if (!isInPakistanRange) {
    // Try to correct common coordinate mistakes
    if (parsedLat > 40 && parsedLng < 40) {
      // Likely swapped coordinates
      [parsedLat, parsedLng] = [parsedLng, parsedLat];
      console.log(`Swapped coordinates: ${lat}, ${lng} -> ${parsedLat}, ${parsedLng}`);
    }
  }
  
  // Ensure coordinates are within valid ranges after correction
  parsedLat = Math.max(-90, Math.min(90, parsedLat));
  parsedLng = Math.max(-180, Math.min(180, parsedLng));
  
  return {
    lat: parsedLat,
    lng: parsedLng,
    isValid: true,
    wasCorrected: !isInPakistanRange && (parsedLat !== parseFloat(lat) || parsedLng !== parseFloat(lng))
  };
};

/**
 * Formats coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Decimal places (default: 4)
 * @returns {string} - Formatted coordinate string
 */
export const formatCoordinates = (lat, lng, precision = 4) => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Calculates distance between two coordinates in kilometers
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
