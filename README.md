<div align="center">

# 💒 Wedding Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0.0-green.svg)

**A comprehensive full-stack wedding management application that helps you plan and organize every aspect of your special day.**

[🚀 Live Demo](#-live-demo) • [📖 Documentation](#-documentation) • [🛠️ Installation](#-installation) • [🤝 Contributing](#-contributing) • [📄 License](#-license)

</div>

---

## ✨ Features

### 🎯 **Core Management**
- **👥 Guest Management** - Complete guest list with RSVP tracking, meal preferences, and seating arrangements
- **💰 Expense Tracker** - Categorized expense management with payment status and budget monitoring
- **🍽️ Food Planning** - Detailed food item management with cost calculations and dietary preferences
- **🎁 Pawo System** - Special gift tracking system with Upper, Awoto, and Banodo calculations
- **📍 Location Management** - Interactive map view of all wedding venues and locations

### 📊 **Data Visualization**
- **📈 Interactive Charts** - Pie charts for expense distribution and pawo breakdown
- **📊 Bar Charts** - Category comparisons and top contributors analysis
- **📉 Line Charts** - Monthly trends and spending patterns
- **📱 Real-time Dashboard** - Live statistics and key metrics

### 🎨 **Modern UI/UX**
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Beautiful Interface** - Modern design with Tailwind CSS
- **🗺️ Interactive Maps** - Mapbox integration for location visualization
- **⚡ Fast Performance** - Optimized React components and efficient data handling

---

## 🏗️ Technology Stack

<table>
<tr>
<td align="center" width="50%">

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **RESTful API** design
- **CORS** enabled
- **Express Validator** for data validation

</td>
<td align="center" width="50%">

### **Frontend**
- **React 18** with Hooks
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Mapbox GL JS** for maps
- **Custom SVG Charts**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### **1. Clone the Repository**
```bash
git clone https://github.com/markprop/Wedding-Management-System.git
cd Wedding-Management-System
```

### **2. Install Dependencies**
```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately
npm run install-backend
npm run install-frontend
```

### **3. Environment Setup**

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
MAPBOX_ACCESS_TOKEN=your_mapbox_token
PORT=5000
```

### **4. Start the Application**

**Option A: Start Both Services**
```bash
# Terminal 1 - Backend
npm run start-backend

# Terminal 2 - Frontend  
npm run start-frontend
```

**Option B: Development Mode**
```bash
# Terminal 1 - Backend (with auto-restart)
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

### **5. Access the Application**
Open your browser and navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
Wedding-Management-System/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js                 # MongoDB connection
│   ├── 📁 controllers/
│   │   ├── expenseController.js  # Expense CRUD operations
│   │   ├── foodController.js     # Food item CRUD operations
│   │   ├── guestController.js    # Guest CRUD operations
│   │   ├── locationController.js # Location CRUD operations
│   │   └── importExportController.js # Data import/export
│   ├── 📁 models/
│   │   ├── Expense.js           # Expense schema
│   │   ├── FoodItem.js          # Food item schema
│   │   ├── Guest.js             # Guest schema with pawo system
│   │   └── Location.js          # Location schema
│   ├── 📁 routes/
│   │   ├── expenses.js          # Expense routes
│   │   ├── food.js              # Food routes
│   │   ├── guests.js            # Guest routes
│   │   ├── locations.js         # Location routes
│   │   └── importExport.js      # Import/Export routes
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── index.html           # HTML template
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── PieChart.jsx     # Pie chart component
│   │   │   ├── BarChart.jsx     # Bar chart component
│   │   │   ├── LineChart.jsx    # Line chart component
│   │   │   ├── MapView.jsx      # Map visualization
│   │   │   ├── GuestModal.jsx   # Guest form modal
│   │   │   ├── ExpenseModal.jsx # Expense form modal
│   │   │   ├── FoodModal.jsx    # Food form modal
│   │   │   ├── LocationModal.jsx# Location form modal
│   │   │   └── ImportExportModal.jsx # Data import/export modal
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── GuestManagement.jsx    # Guest management
│   │   │   ├── ExpenseTracker.jsx     # Expense tracking
│   │   │   ├── FoodPlanning.jsx       # Food planning
│   │   │   ├── PawoTracker.jsx        # Pawo tracking
│   │   │   └── LocationManagement.jsx # Location management
│   │   ├── 📁 services/
│   │   │   └── api.js           # API service layer
│   │   ├── 📁 utils/
│   │   │   ├── formatters.js    # Utility functions
│   │   │   └── dataFormatters.js # Data formatting utilities
│   │   ├── App.jsx              # Main App component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Frontend dependencies
│   └── tailwind.config.js       # Tailwind configuration
├── 📄 README.md                 # This file
├── 📄 LICENSE                   # MIT License
├── 📄 CONTRIBUTING.md           # Contributing guidelines
└── 📄 package.json              # Root package.json
```

---

## 🎯 Usage Guide

### **1. 📊 Dashboard**
- View key metrics: total expenses, confirmed guests, net pawo total, food costs
- Interactive charts showing expense distribution and pawo breakdown
- Budget status with net balance calculation
- Quick access to all major features

### **2. 👥 Guest Management**
- Add/edit guests with complete information
- Track RSVP status and meal preferences
- Manage pawo contributions (Upper, Awoto, Banodo)
- View guest statistics and charts
- Export guest list for printing

### **3. 💰 Expense Tracker**
- Categorize expenses (Venue, Catering, Decorations, etc.)
- Track payment status and due dates
- Filter and search expenses
- View expense analytics and trends
- Export expense reports

### **4. 🍽️ Food Planning**
- Manage food items with quantities and costs
- Categorize by course (breakfast, lunch, dinner, snack)
- Track per-person vs shared items
- Calculate total food costs
- Plan dietary accommodations

### **5. 🎁 Pawo Tracker**
- Detailed view of all pawo contributions
- Automatic calculation of net contributions
- Top contributors and location-based analysis
- Visual breakdown of Upper, Awoto, and Banodo
- Export pawo reports

### **6. 📍 Location Management**
- Add wedding-related locations with coordinates
- Interactive map visualization with Mapbox
- Categorize by type (venue, reception, mehndi, etc.)
- View location statistics
- Get directions and travel times

---

## 🔧 API Documentation

### **Guests Endpoints**
```http
GET    /api/guests           # Get all guests
GET    /api/guests/:id       # Get guest by ID
POST   /api/guests           # Create new guest
PUT    /api/guests/:id       # Update guest
DELETE /api/guests/:id       # Delete guest
GET    /api/guests/stats     # Get guest statistics
```

### **Expenses Endpoints**
```http
GET    /api/expenses         # Get all expenses
GET    /api/expenses/:id     # Get expense by ID
POST   /api/expenses         # Create new expense
PUT    /api/expenses/:id     # Update expense
DELETE /api/expenses/:id     # Delete expense
GET    /api/expenses/stats   # Get expense statistics
```

### **Food Items Endpoints**
```http
GET    /api/food             # Get all food items
GET    /api/food/:id         # Get food item by ID
POST   /api/food             # Create new food item
PUT    /api/food/:id         # Update food item
DELETE /api/food/:id         # Delete food item
GET    /api/food/stats       # Get food statistics
```

### **Locations Endpoints**
```http
GET    /api/locations        # Get all locations
GET    /api/locations/:id    # Get location by ID
POST   /api/locations        # Create new location
PUT    /api/locations/:id    # Update location
DELETE /api/locations/:id    # Delete location
GET    /api/locations/stats  # Get location statistics
```

### **Import/Export Endpoints**
```http
POST   /api/import/guests    # Import guests from CSV/Excel
POST   /api/import/expenses  # Import expenses from CSV/Excel
GET    /api/export/guests    # Export guests to CSV
GET    /api/export/expenses  # Export expenses to CSV
GET    /api/export/all       # Export all data
```

---

## 🎁 Pawo System Explained

The application includes a special **Pawo (Gift) Tracking System**:

| Field | Description |
|-------|-------------|
| **Upper** | Direct contribution from the guest |
| **Awoto** | Amount given to the guest in previous events |
| **Banodo** | Additional gift amount |
| **Previous Amount** | Automatically equals Awoto amount |
| **Net Contribution** | Upper amount (since Previous and Awoto cancel each other out) |

This system helps track the complex gift exchange patterns common in wedding celebrations.

---

## 🛠️ Development

### **Available Scripts**

**Root Level:**
```bash
npm run install-all      # Install all dependencies
npm run start-backend    # Start backend server
npm run start-frontend   # Start frontend server
npm run dev-backend      # Start backend in development mode
npm run dev-frontend     # Start frontend in development mode
npm run build            # Build frontend for production
npm run test             # Run all tests
```

**Backend:**
```bash
cd backend
npm start                # Start server
npm run dev              # Start with nodemon
npm test                 # Run backend tests
```

**Frontend:**
```bash
cd frontend
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run frontend tests
```

### **Adding New Features**

1. **Backend:**
   - Create new models in `backend/models/`
   - Add controllers in `backend/controllers/`
   - Create routes in `backend/routes/`
   - Update `server.js` to include new routes

2. **Frontend:**
   - Add new pages in `frontend/src/pages/`
   - Create components in `frontend/src/components/`
   - Update navigation in `Navbar.jsx`
   - Add API calls in `services/api.js`

---

## 🐛 Troubleshooting

### **Common Issues**

<details>
<summary><strong>MongoDB Connection Error</strong></summary>

- ✅ Check if the connection string is correct
- ✅ Ensure MongoDB Atlas cluster is running
- ✅ Verify network access settings
- ✅ Check if IP address is whitelisted

</details>

<details>
<summary><strong>CORS Issues</strong></summary>

- ✅ Ensure backend CORS is properly configured
- ✅ Check if frontend is running on the correct port
- ✅ Verify API base URL in frontend

</details>

<details>
<summary><strong>API Calls Failing</strong></summary>

- ✅ Verify backend server is running on port 5000
- ✅ Check browser console for error messages
- ✅ Ensure API endpoints are correctly defined
- ✅ Check network tab for failed requests

</details>

<details>
<summary><strong>Charts Not Displaying</strong></summary>

- ✅ Check if data is being passed correctly to chart components
- ✅ Verify chart component implementations
- ✅ Ensure data is in the correct format

</details>

<details>
<summary><strong>Map Not Loading</strong></summary>

- ✅ Verify Mapbox access token is correct
- ✅ Check if token has proper permissions
- ✅ Ensure coordinates are valid

</details>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **How to Contribute:**

1. 🍴 Fork the repository
2. 🌟 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React** - For the amazing frontend framework
- **Express.js** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the beautiful styling system
- **Mapbox** - For the interactive mapping capabilities

---

## 📞 Support

- 📧 **Email**: [your-email@example.com](mailto:your-email@example.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/markprop/Wedding-Management-System/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/markprop/Wedding-Management-System/discussions)

---

<div align="center">

**Made with ❤️ for couples planning their special day**

[⭐ Star this repo](https://github.com/markprop/Wedding-Management-System) • [🍴 Fork it](https://github.com/markprop/Wedding-Management-System/fork) • [🐛 Report Bug](https://github.com/markprop/Wedding-Management-System/issues)

---

**Happy Wedding Planning! 💒✨**

</div>