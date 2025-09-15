// Format currency in PKR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Generate a formatted report from exported data
export const generateFormattedReport = (data) => {
  const report = {
    title: "Wedding Management System - Data Report",
    generatedAt: formatDateTime(new Date()),
    summary: {
      totalLocations: data.locations.length,
      totalGuests: data.guests.length,
      totalExpenses: data.expenses.length,
      totalFoodItems: data.foodItems.length,
      totalExpenseAmount: data.expenses.reduce((sum, exp) => sum + exp.amount, 0),
      totalPawoAmount: data.guests.reduce((sum, guest) => sum + (guest.pawo?.upper || 0), 0),
      totalFoodCost: data.foodItems.reduce((sum, food) => sum + (food.quantity * food.cost), 0)
    },
    locations: data.locations.map(loc => ({
      name: loc.name,
      address: loc.address,
      type: loc.type.charAt(0).toUpperCase() + loc.type.slice(1),
      coordinates: `${loc.lat}, ${loc.lng}`,
      addedOn: formatDate(loc.createdAt)
    })),
    guests: data.guests.map(guest => ({
      name: guest.name,
      phone: guest.phone,
      email: guest.email || 'N/A',
      attending: guest.attending ? 'Yes' : 'No',
      location: guest.locationName || 'N/A',
      pawo: {
        upper: formatCurrency(guest.pawo?.upper || 0),
        awoto: formatCurrency(guest.pawo?.awoto || 0),
        banodo: formatCurrency(guest.pawo?.banodo || 0),
        netContribution: formatCurrency(guest.pawo?.upper || 0)
      },
      mealPreference: guest.mealPreference,
      tableNumber: guest.tableNumber || 'N/A',
      rsvpDate: formatDate(guest.rsvpDate)
    })),
    expenses: data.expenses.map(expense => ({
      description: expense.description,
      category: expense.category,
      vendor: expense.vendor,
      amount: formatCurrency(expense.amount),
      date: formatDate(expense.date),
      location: expense.locationName || 'N/A',
      status: expense.paid ? 'Paid' : 'Unpaid'
    })),
    foodItems: data.foodItems.map(food => ({
      name: food.name,
      category: food.category,
      course: food.course.charAt(0).toUpperCase() + food.course.slice(1),
      quantity: `${food.quantity} ${food.unit}`,
      costPerUnit: formatCurrency(food.cost),
      totalCost: formatCurrency(food.quantity * food.cost),
      perPerson: food.perPerson ? 'Yes' : 'No'
    }))
  };

  return report;
};

// Generate a CSV format for specific data
export const generateCSV = (data, type) => {
  let csv = '';
  
  switch (type) {
    case 'guests':
      csv = 'Name,Phone,Email,Attending,Location,Upper Amount,Awoto Amount,Banodo Amount,Net Contribution,Meal Preference,Table Number,RSVP Date\n';
      data.forEach(guest => {
        csv += `"${guest.name}","${guest.phone}","${guest.email || ''}","${guest.attending ? 'Yes' : 'No'}","${guest.locationName || ''}","${guest.pawo?.upper || 0}","${guest.pawo?.awoto || 0}","${guest.pawo?.banodo || 0}","${guest.pawo?.upper || 0}","${guest.mealPreference}","${guest.tableNumber || ''}","${formatDate(guest.rsvpDate)}"\n`;
      });
      break;
      
    case 'expenses':
      csv = 'Description,Category,Vendor,Amount,Date,Location,Status\n';
      data.forEach(expense => {
        csv += `"${expense.description}","${expense.category}","${expense.vendor}","${expense.amount}","${formatDate(expense.date)}","${expense.locationName || ''}","${expense.paid ? 'Paid' : 'Unpaid'}"\n`;
      });
      break;
      
    case 'foodItems':
      csv = 'Name,Category,Course,Quantity,Unit,Cost Per Unit,Total Cost,Per Person\n';
      data.forEach(food => {
        csv += `"${food.name}","${food.category}","${food.course}","${food.quantity}","${food.unit}","${food.cost}","${food.quantity * food.cost}","${food.perPerson ? 'Yes' : 'No'}"\n`;
      });
      break;
      
    case 'locations':
      csv = 'Name,Address,Type,Latitude,Longitude\n';
      data.forEach(location => {
        csv += `"${location.name}","${location.address}","${location.type}","${location.lat}","${location.lng}"\n`;
      });
      break;
  }
  
  return csv;
};

// Download data as formatted file
export const downloadData = (data, filename, type = 'json') => {
  let content, mimeType, fileExtension;
  
  if (type === 'csv') {
    content = generateCSV(data, filename.split('-')[0]);
    mimeType = 'text/csv';
    fileExtension = 'csv';
  } else {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
    fileExtension = 'json';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${fileExtension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
