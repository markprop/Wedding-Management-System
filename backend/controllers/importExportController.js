const Guest = require('../models/Guest');
const Expense = require('../models/Expense');
const FoodItem = require('../models/FoodItem');
const Location = require('../models/Location');

// Import all data from JSON
const importAllData = async (req, res) => {
  try {
    const { locations, guests, expenses, foodItems } = req.body;
    
    let importedData = {
      locations: [],
      guests: [],
      expenses: [],
      foodItems: []
    };

    // Import locations first
    if (locations && locations.length > 0) {
      const locationPromises = locations.map(locationData => {
        const location = new Location(locationData);
        return location.save();
      });
      importedData.locations = await Promise.all(locationPromises);
    }

    // Get location IDs for mapping
    const allLocations = await Location.find();
    const locationMap = {};
    allLocations.forEach(loc => {
      locationMap[loc.name] = loc._id;
    });

    // Import guests
    if (guests && guests.length > 0) {
      const guestPromises = guests.map(guestData => {
        // Map location name to ID if provided
        if (guestData.locationName && locationMap[guestData.locationName]) {
          guestData.locationId = locationMap[guestData.locationName];
        }
        delete guestData.locationName; // Remove the temporary field
        
        const guest = new Guest(guestData);
        return guest.save();
      });
      importedData.guests = await Promise.all(guestPromises);
    }

    // Import expenses
    if (expenses && expenses.length > 0) {
      const expensePromises = expenses.map(expenseData => {
        // Map location name to ID if provided
        if (expenseData.locationName && locationMap[expenseData.locationName]) {
          expenseData.locationId = locationMap[expenseData.locationName];
        }
        delete expenseData.locationName; // Remove the temporary field
        
        const expense = new Expense(expenseData);
        return expense.save();
      });
      importedData.expenses = await Promise.all(expensePromises);
    }

    // Import food items
    if (foodItems && foodItems.length > 0) {
      const foodPromises = foodItems.map(foodData => {
        const foodItem = new FoodItem(foodData);
        return foodItem.save();
      });
      importedData.foodItems = await Promise.all(foodPromises);
    }

    res.json({
      message: 'Data imported successfully',
      counts: {
        locations: importedData.locations.length,
        guests: importedData.guests.length,
        expenses: importedData.expenses.length,
        foodItems: importedData.foodItems.length
      },
      data: importedData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all data
const exportAllData = async (req, res) => {
  try {
    const [locations, guests, expenses, foodItems] = await Promise.all([
      Location.find().lean(),
      Guest.find().populate('locationId', 'name type address').lean(),
      Expense.find().populate('locationId', 'name type address').lean(),
      FoodItem.find().lean()
    ]);

    // Format the data for export
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalRecords: {
          locations: locations.length,
          guests: guests.length,
          expenses: expenses.length,
          foodItems: foodItems.length
        }
      },
      locations: locations.map(loc => ({
        name: loc.name,
        address: loc.address,
        lat: loc.lat,
        lng: loc.lng,
        type: loc.type,
        createdAt: loc.createdAt
      })),
      guests: guests.map(guest => ({
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        attending: guest.attending,
        pawo: {
          upper: guest.pawo?.upper || 0,
          awoto: guest.pawo?.awoto || 0,
          banodo: guest.pawo?.banodo || 0
        },
        previousAmount: guest.previousAmount,
        locationName: guest.locationId?.name || null,
        rsvpDate: guest.rsvpDate,
        mealPreference: guest.mealPreference,
        tableNumber: guest.tableNumber,
        createdAt: guest.createdAt
      })),
      expenses: expenses.map(expense => ({
        category: expense.category,
        description: expense.description,
        vendor: expense.vendor,
        amount: expense.amount,
        date: expense.date,
        locationName: expense.locationId?.name || null,
        paid: expense.paid,
        createdAt: expense.createdAt
      })),
      foodItems: foodItems.map(food => ({
        name: food.name,
        category: food.category,
        quantity: food.quantity,
        unit: food.unit,
        cost: food.cost,
        perPerson: food.perPerson,
        course: food.course,
        totalCost: food.quantity * food.cost,
        createdAt: food.createdAt
      }))
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="wedding-data-export-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear all data
const clearAllData = async (req, res) => {
  try {
    await Promise.all([
      Guest.deleteMany({}),
      Expense.deleteMany({}),
      FoodItem.deleteMany({}),
      Location.deleteMany({})
    ]);

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sample data template
const getSampleData = async (req, res) => {
  const sampleData = {
    locations: [
      {
        name: "Grand Palace Hotel",
        address: "123 Main Street, Karachi, Pakistan",
        lat: 24.8607,
        lng: 67.0011,
        type: "venue"
      },
      {
        name: "Royal Garden Reception Hall",
        address: "456 Garden Avenue, Karachi, Pakistan",
        lat: 24.8500,
        lng: 67.0100,
        type: "reception"
      },
      {
        name: "Mehndi Garden",
        address: "789 Flower Street, Karachi, Pakistan",
        lat: 24.8700,
        lng: 67.0200,
        type: "mehndi"
      },
      {
        name: "Groom's House",
        address: "321 Family Lane, Karachi, Pakistan",
        lat: 24.8400,
        lng: 67.0050,
        type: "barat"
      },
      {
        name: "Photo Studio Pro",
        address: "654 Studio Road, Karachi, Pakistan",
        lat: 24.8800,
        lng: 67.0300,
        type: "photography"
      }
    ],
    guests: [
      {
        name: "Ahmed Khan",
        phone: "+92-300-1234567",
        email: "ahmed.khan@email.com",
        attending: true,
        pawo: {
          upper: 50000,
          awoto: 30000,
          banodo: 10000
        },
        locationName: "Grand Palace Hotel",
        rsvpDate: "2024-01-15",
        mealPreference: "non-vegetarian",
        tableNumber: 1
      },
      {
        name: "Fatima Ali",
        phone: "+92-301-2345678",
        email: "fatima.ali@email.com",
        attending: true,
        pawo: {
          upper: 75000,
          awoto: 50000,
          banodo: 15000
        },
        locationName: "Royal Garden Reception Hall",
        rsvpDate: "2024-01-16",
        mealPreference: "vegetarian",
        tableNumber: 2
      },
      {
        name: "Hassan Sheikh",
        phone: "+92-302-3456789",
        email: "hassan.sheikh@email.com",
        attending: false,
        pawo: {
          upper: 25000,
          awoto: 20000,
          banodo: 5000
        },
        locationName: "Grand Palace Hotel",
        rsvpDate: "2024-01-17",
        mealPreference: "no-preference",
        tableNumber: null
      },
      {
        name: "Ayesha Malik",
        phone: "+92-303-4567890",
        email: "ayesha.malik@email.com",
        attending: true,
        pawo: {
          upper: 100000,
          awoto: 60000,
          banodo: 20000
        },
        locationName: "Royal Garden Reception Hall",
        rsvpDate: "2024-01-18",
        mealPreference: "vegan",
        tableNumber: 1
      },
      {
        name: "Omar Hassan",
        phone: "+92-304-5678901",
        email: "omar.hassan@email.com",
        attending: true,
        pawo: {
          upper: 30000,
          awoto: 25000,
          banodo: 8000
        },
        locationName: "Mehndi Garden",
        rsvpDate: "2024-01-19",
        mealPreference: "non-vegetarian",
        tableNumber: 3
      }
    ],
    expenses: [
      {
        category: "Venue",
        description: "Wedding Hall Rental - Grand Palace Hotel",
        vendor: "Grand Palace Hotel",
        amount: 500000,
        date: "2024-02-15",
        locationName: "Grand Palace Hotel",
        paid: true
      },
      {
        category: "Catering",
        description: "Wedding Dinner for 200 guests",
        vendor: "Royal Catering Services",
        amount: 300000,
        date: "2024-02-20",
        locationName: "Royal Garden Reception Hall",
        paid: false
      },
      {
        category: "Decorations",
        description: "Flower arrangements and stage decoration",
        vendor: "Bloom & Blossom",
        amount: 150000,
        date: "2024-02-18",
        locationName: "Grand Palace Hotel",
        paid: true
      },
      {
        category: "Photography",
        description: "Wedding photography and videography package",
        vendor: "Photo Studio Pro",
        amount: 200000,
        date: "2024-02-10",
        locationName: "Photo Studio Pro",
        paid: false
      },
      {
        category: "Attire",
        description: "Bridal dress and groom's suit",
        vendor: "Fashion House",
        amount: 250000,
        date: "2024-02-05",
        locationName: null,
        paid: true
      },
      {
        category: "Entertainment",
        description: "DJ and sound system",
        vendor: "Sound Waves",
        amount: 80000,
        date: "2024-02-22",
        locationName: "Royal Garden Reception Hall",
        paid: false
      },
      {
        category: "Transportation",
        description: "Wedding car and guest transportation",
        vendor: "Luxury Cars",
        amount: 120000,
        date: "2024-02-25",
        locationName: null,
        paid: true
      }
    ],
    foodItems: [
      {
        name: "Biryani (Chicken)",
        category: "Main Course",
        quantity: 50,
        unit: "kg",
        cost: 800,
        perPerson: true,
        course: "dinner"
      },
      {
        name: "Biryani (Beef)",
        category: "Main Course",
        quantity: 30,
        unit: "kg",
        cost: 900,
        perPerson: true,
        course: "dinner"
      },
      {
        name: "Naan Bread",
        category: "Side Dish",
        quantity: 200,
        unit: "pieces",
        cost: 25,
        perPerson: true,
        course: "dinner"
      },
      {
        name: "Chicken Karahi",
        category: "Main Course",
        quantity: 25,
        unit: "kg",
        cost: 1200,
        perPerson: false,
        course: "dinner"
      },
      {
        name: "Fruit Chaat",
        category: "Appetizer",
        quantity: 20,
        unit: "kg",
        cost: 300,
        perPerson: false,
        course: "dinner"
      },
      {
        name: "Gulab Jamun",
        category: "Dessert",
        quantity: 100,
        unit: "pieces",
        cost: 15,
        perPerson: true,
        course: "dinner"
      },
      {
        name: "Kheer",
        category: "Dessert",
        quantity: 15,
        unit: "liters",
        cost: 200,
        perPerson: false,
        course: "dinner"
      },
      {
        name: "Tea",
        category: "Beverage",
        quantity: 10,
        unit: "liters",
        cost: 150,
        perPerson: false,
        course: "breakfast"
      },
      {
        name: "Coffee",
        category: "Beverage",
        quantity: 5,
        unit: "liters",
        cost: 300,
        perPerson: false,
        course: "breakfast"
      },
      {
        name: "Samosa",
        category: "Snack",
        quantity: 150,
        unit: "pieces",
        cost: 20,
        perPerson: true,
        course: "snack"
      }
    ]
  };

  res.json(sampleData);
};

module.exports = {
  importAllData,
  exportAllData,
  clearAllData,
  getSampleData
};
