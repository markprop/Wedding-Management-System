# Import/Export Guide for Wedding Management System

## 🚀 Overview

The Wedding Management System now includes comprehensive import/export functionality that allows you to:
- **Import** sample data or your own JSON files
- **Export** data in JSON or CSV formats
- **Load** pre-built sample data for testing
- **Clear** all data when needed

## 📁 How to Access Import/Export

1. Open your Wedding Management System at http://localhost:3000
2. Click the **"📁 Import/Export"** button in the top navigation bar
3. Choose from three tabs: Import Data, Export Data, or Sample Data

## 📥 Import Data

### Method 1: Load Sample Data (Recommended for Testing)
1. Click the **"Sample Data"** tab
2. Click **"Load Sample Data"** button
3. The system will automatically load:
   - 5 sample locations (venue, reception, mehndi, barat, photography)
   - 5 sample guests with pawo contributions
   - 7 sample expenses across different categories
   - 10 sample food items with cost calculations

### Method 2: Import from JSON File
1. Click the **"Import Data"** tab
2. Click **"Choose File"** and select a JSON file
3. Click **"Import Data"** button
4. The system will process and import all data

### JSON File Format
Your JSON file should follow this structure:

```json
{
  "locations": [
    {
      "name": "Location Name",
      "address": "Full Address",
      "lat": 24.8607,
      "lng": 67.0011,
      "type": "venue"
    }
  ],
  "guests": [
    {
      "name": "Guest Name",
      "phone": "+92-300-1234567",
      "email": "email@example.com",
      "attending": true,
      "pawo": {
        "upper": 50000,
        "awoto": 30000,
        "banodo": 10000
      },
      "locationName": "Location Name",
      "rsvpDate": "2024-01-15",
      "mealPreference": "non-vegetarian",
      "tableNumber": 1
    }
  ],
  "expenses": [
    {
      "category": "Venue",
      "description": "Expense Description",
      "vendor": "Vendor Name",
      "amount": 500000,
      "date": "2024-02-15",
      "locationName": "Location Name",
      "paid": true
    }
  ],
  "foodItems": [
    {
      "name": "Food Item Name",
      "category": "Main Course",
      "quantity": 50,
      "unit": "kg",
      "cost": 800,
      "perPerson": true,
      "course": "dinner"
    }
  ]
}
```

## 📤 Export Data

### Method 1: Export as JSON (Complete Data)
1. Click the **"Export Data"** tab
2. Click **"Export as JSON"** button
3. A complete JSON file will be downloaded with all your data

### Method 2: Export as CSV (Separate Files)
1. Click the **"Export Data"** tab
2. Click **"Export as CSV"** button
3. Multiple CSV files will be downloaded:
   - `guests-export-YYYY-MM-DD.csv`
   - `expenses-export-YYYY-MM-DD.csv`
   - `food-items-export-YYYY-MM-DD.csv`
   - `locations-export-YYYY-MM-DD.csv`

## 🗑️ Clear All Data

1. Click the **"Sample Data"** tab
2. Click **"Clear All Data"** button
3. Confirm the action in the popup
4. All data will be permanently deleted

## 📊 Sample Data Details

### Locations (5 items)
- **Grand Palace Hotel** (venue) - Main wedding venue
- **Royal Garden Reception Hall** (reception) - Reception location
- **Mehndi Garden** (mehndi) - Mehndi ceremony location
- **Groom's House** (barat) - Barat procession starting point
- **Photo Studio Pro** (photography) - Photography studio

### Guests (5 items)
- **Ahmed Khan** - Upper: 50,000 PKR, Awoto: 30,000 PKR, Banodo: 10,000 PKR
- **Fatima Ali** - Upper: 75,000 PKR, Awoto: 50,000 PKR, Banodo: 15,000 PKR
- **Hassan Sheikh** - Upper: 25,000 PKR, Awoto: 20,000 PKR, Banodo: 5,000 PKR
- **Ayesha Malik** - Upper: 100,000 PKR, Awoto: 60,000 PKR, Banodo: 20,000 PKR
- **Omar Hassan** - Upper: 30,000 PKR, Awoto: 25,000 PKR, Banodo: 8,000 PKR

### Expenses (7 items)
- **Venue Rental** - 500,000 PKR (Paid)
- **Catering** - 300,000 PKR (Unpaid)
- **Decorations** - 150,000 PKR (Paid)
- **Photography** - 200,000 PKR (Unpaid)
- **Attire** - 250,000 PKR (Paid)
- **Entertainment** - 80,000 PKR (Unpaid)
- **Transportation** - 120,000 PKR (Paid)

### Food Items (10 items)
- **Biryani (Chicken)** - 50 kg @ 800 PKR/kg
- **Biryani (Beef)** - 30 kg @ 900 PKR/kg
- **Naan Bread** - 200 pieces @ 25 PKR/piece
- **Chicken Karahi** - 25 kg @ 1,200 PKR/kg
- **Fruit Chaat** - 20 kg @ 300 PKR/kg
- **Gulab Jamun** - 100 pieces @ 15 PKR/piece
- **Kheer** - 15 liters @ 200 PKR/liter
- **Tea** - 10 liters @ 150 PKR/liter
- **Coffee** - 5 liters @ 300 PKR/liter
- **Samosa** - 150 pieces @ 20 PKR/piece

## 🔧 Technical Details

### API Endpoints
- `GET /api/import-export/sample` - Get sample data template
- `POST /api/import-export/import` - Import data from JSON
- `GET /api/import-export/export` - Export all data as JSON
- `DELETE /api/import-export/clear` - Clear all data

### File Formats
- **JSON Export**: Complete data with metadata and timestamps
- **CSV Export**: Separate files for each data type, formatted for Excel/Google Sheets
- **JSON Import**: Accepts the same format as JSON export

### Data Validation
- All required fields are validated before import
- Location names are mapped to IDs automatically
- Pawo calculations are handled automatically
- Duplicate data is handled gracefully

## 🎯 Best Practices

1. **Always backup your data** before clearing or importing new data
2. **Use sample data first** to familiarize yourself with the system
3. **Export regularly** to keep backups of your wedding planning data
4. **Check data integrity** after importing large datasets
5. **Use descriptive names** for locations and vendors

## 🚨 Important Notes

- **Location References**: When importing, use `locationName` field to reference locations by name
- **Date Format**: Use ISO date format (YYYY-MM-DD) for all dates
- **Currency**: All amounts are in Pakistani Rupees (PKR)
- **Pawo System**: Previous amount automatically equals Awoto amount
- **File Size**: Large imports may take a few moments to process

## 🆘 Troubleshooting

### Import Issues
- **Invalid JSON**: Check your JSON file format
- **Missing Locations**: Ensure location names match exactly
- **Validation Errors**: Check required fields are present

### Export Issues
- **Empty Data**: Ensure you have data to export
- **File Download**: Check browser download settings
- **CSV Format**: Use Excel or Google Sheets to open CSV files

### General Issues
- **Server Connection**: Ensure backend is running on port 5000
- **Browser Compatibility**: Use modern browsers (Chrome, Firefox, Safari, Edge)
- **File Permissions**: Check file system permissions for downloads

---

**Happy Wedding Planning! 💒✨**

For support or questions, refer to the main README.md file or contact the development team.
