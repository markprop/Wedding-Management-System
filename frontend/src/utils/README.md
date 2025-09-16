# Utility Functions

## coordinateUtils.js

This module provides utility functions for handling map coordinates in the Wedding Planner application.

### Functions

#### `validateAndCorrectCoordinates(lat, lng)`
Validates and corrects coordinates for the Pakistan/Karachi area.

**Parameters:**
- `lat` (number|string): Latitude value
- `lng` (number|string): Longitude value

**Returns:**
- `Object` with properties:
  - `lat` (number): Corrected latitude
  - `lng` (number): Corrected longitude
  - `isValid` (boolean): Whether coordinates are valid
  - `error` (string): Error message if invalid
  - `wasCorrected` (boolean): Whether coordinates were corrected

**Features:**
- Validates coordinate format and range
- Detects and corrects common coordinate mistakes (e.g., swapped lat/lng)
- Ensures coordinates are within valid geographic ranges
- Provides warnings for coordinates outside Pakistan area

#### `formatCoordinates(lat, lng, precision)`
Formats coordinates for display.

**Parameters:**
- `lat` (number): Latitude
- `lng` (number): Longitude
- `precision` (number): Decimal places (default: 4)

**Returns:**
- `string`: Formatted coordinate string

#### `calculateDistance(lat1, lng1, lat2, lng2)`
Calculates distance between two coordinates using the Haversine formula.

**Parameters:**
- `lat1`, `lng1` (number): First coordinate
- `lat2`, `lng2` (number): Second coordinate

**Returns:**
- `number`: Distance in kilometers

### Usage Example

```javascript
import { validateAndCorrectCoordinates, formatCoordinates } from '../utils/coordinateUtils';

// Validate and correct coordinates
const { lat, lng, isValid, wasCorrected } = validateAndCorrectCoordinates(24.8607, 67.0011);

if (isValid) {
  console.log(`Corrected coordinates: ${formatCoordinates(lat, lng)}`);
  if (wasCorrected) {
    console.log('Coordinates were corrected');
  }
}
```
