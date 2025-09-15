# Mapbox Integration Guide

## 🗺️ Overview

The Wedding Management System now includes professional map visualization using Mapbox GL JS. This provides interactive, real-world maps with custom markers for all wedding locations.

## 🔑 Environment Variables Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://saink4831_db_user:Wedding@suresh-wedding.autdlq2.mongodb.net/wedding_planner?retryWrites=true&w=majority&appName=Suresh-Wedding
MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic3VyZXNoYmFyYWNoMjAwMSIsImEiOiJjbWYzcDh5a3MwMGV0MmtzNDQ3ODlkY3p6In0.OVdVP7rRea7wK1UEn1OSfw
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** The Mapbox access token is now securely stored in the backend and fetched via API call. No need to expose it in frontend environment variables.

## 🚀 Features

### Interactive Map
- **Real-world maps** with satellite and street views
- **Custom markers** for each location type
- **Clickable markers** with detailed popups
- **Auto-zoom** to fit all locations
- **Responsive design** that works on all devices

### Location Types & Colors
- 🏢 **Venue** - Blue (#3B82F6)
- 🎉 **Reception** - Green (#10B981)
- 🎨 **Mehndi** - Orange (#F59E0B)
- 🚗 **Barat** - Red (#EF4444)
- 📸 **Photography** - Purple (#8B5CF6)
- 📍 **Custom** - Gray (#6B7280)

### Interactive Features
- **Hover effects** on location list items
- **Popup information** showing:
  - Location name
  - Full address
  - Location type
  - Coordinates
- **Legend** showing all location types with counts
- **Location list** with coordinates

## 🛠️ Technical Implementation

### Dependencies Added
```bash
npm install mapbox-gl
```

### Backend Configuration
- **Secure token storage** in backend environment variables
- **API endpoint** `/api/mapbox/config` for token distribution
- **Error handling** for missing or invalid tokens
- **Configuration management** for map styles and settings

### Frontend Implementation
- **API-based configuration** fetching from backend
- **Automatic bounds calculation** to fit all locations
- **Custom marker styling** with numbered indicators
- **Popup system** with detailed location information
- **Loading states** and error handling
- **Responsive design** with proper sizing

### Map Configuration
- **Style**: Mapbox Streets v12 (configurable via backend)
- **Default Center**: Karachi, Pakistan (67.0011, 24.8607)
- **Token Management**: Secure backend-to-frontend distribution
- **Auto-fit bounds** with 50px padding
- **Zoom levels** automatically calculated based on location spread

## 📍 How to Use

### 1. View Locations on Map
1. Navigate to **Location Management** page
2. The map will automatically load with all your locations
3. Click on markers to see detailed information
4. Use the legend to identify different location types

### 2. Add New Locations
1. Click **"Add Location"** button
2. Enter location details including coordinates
3. The map will automatically update with the new marker

### 3. Interactive Features
- **Click markers** to see popup information
- **Hover over location list** items for better visibility
- **Use map controls** to zoom and pan
- **View coordinates** in the location list

## 🎨 Customization

### Changing Map Style
Edit `MapView.jsx` line 35:
```javascript
style: 'mapbox://styles/mapbox/streets-v12', // Change this
```

Available styles:
- `mapbox://styles/mapbox/streets-v12` - Street map
- `mapbox://styles/mapbox/satellite-v9` - Satellite view
- `mapbox://styles/mapbox/outdoors-v12` - Outdoor activities
- `mapbox://styles/mapbox/light-v11` - Light theme
- `mapbox://styles/mapbox/dark-v11` - Dark theme

### Changing Marker Colors
Edit the `getColor` function in `MapView.jsx`:
```javascript
const getColor = (type) => {
  const colors = {
    venue: '#3B82F6',      // Blue
    reception: '#10B981',   // Green
    mehndi: '#F59E0B',      // Orange
    barat: '#EF4444',       // Red
    photography: '#8B5CF6', // Purple
    custom: '#6B7280'       // Gray
  };
  return colors[type] || '#6B7280';
};
```

### Customizing Popup Content
Edit the popup HTML in `MapView.jsx` lines 92-99:
```javascript
.setHTML(`
  <div class="p-2">
    <h3 class="font-bold text-sm">${location.name}</h3>
    <p class="text-xs text-gray-600">${location.address}</p>
    <p class="text-xs text-gray-500 capitalize">${location.type}</p>
    <p class="text-xs text-gray-400">${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
  </div>
`);
```

## 🔧 Troubleshooting

### Map Not Loading
1. **Check access token**: Ensure `REACT_APP_MAPBOX_ACCESS_TOKEN` is set in `.env`
2. **Check network**: Ensure internet connection for map tiles
3. **Check console**: Look for error messages in browser console

### Markers Not Showing
1. **Check data**: Ensure locations have valid lat/lng coordinates
2. **Check bounds**: Map might be zoomed out too far
3. **Check console**: Look for JavaScript errors

### Performance Issues
1. **Limit locations**: Too many markers can slow down the map
2. **Use clustering**: Consider implementing marker clustering for large datasets
3. **Optimize popups**: Reduce popup content for better performance

## 📱 Mobile Support

The map is fully responsive and works on:
- **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Tablet devices** (iPad, Android tablets)

## 🎯 Best Practices

### Location Coordinates
- **Use decimal degrees** format (e.g., 24.8607, 67.0011)
- **Verify coordinates** using Google Maps or other services
- **Test accuracy** by checking if markers appear in correct locations

### Map Performance
- **Limit markers** to reasonable numbers (< 100 recommended)
- **Use appropriate zoom levels** for your area
- **Consider clustering** for large datasets

### User Experience
- **Provide clear instructions** for adding coordinates
- **Use descriptive location names** for easy identification
- **Include full addresses** in location data

## 🔒 Security Notes

- **Access token** is public and safe to use in frontend
- **No sensitive data** is exposed in the map
- **Coordinates** are not sensitive information
- **Map tiles** are served by Mapbox CDN

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Mapbox access token is valid
4. Check network connectivity for map tiles

---

**Happy Mapping! 🗺️✨**

The Wedding Management System now provides professional-grade location visualization to help you plan your perfect wedding!
