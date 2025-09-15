// Format currency in PKR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate net pawo contribution
export const calculateNetPawo = (pawo) => {
  if (!pawo) return 0;
  // Net = Upper + (Awoto - Previous Amount) = Upper (since Previous = Awoto)
  return pawo.upper || 0;
};

// Calculate total pawo from guests array
export const calculateTotalPawo = (guests) => {
  return guests.reduce((total, guest) => {
    return total + calculateNetPawo(guest.pawo);
  }, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
};

// Calculate paid expenses
export const calculatePaidExpenses = (expenses) => {
  return expenses
    .filter(expense => expense.paid)
    .reduce((total, expense) => total + (expense.amount || 0), 0);
};

// Calculate unpaid expenses
export const calculateUnpaidExpenses = (expenses) => {
  return expenses
    .filter(expense => !expense.paid)
    .reduce((total, expense) => total + (expense.amount || 0), 0);
};

// Calculate total food cost
export const calculateTotalFoodCost = (foodItems) => {
  return foodItems.reduce((total, item) => {
    return total + ((item.quantity || 0) * (item.cost || 0));
  }, 0);
};

// Get color for status
export const getStatusColor = (status) => {
  const colors = {
    paid: 'text-green-600 bg-green-100',
    unpaid: 'text-red-600 bg-red-100',
    attending: 'text-green-600 bg-green-100',
    notAttending: 'text-red-600 bg-red-100',
    confirmed: 'text-blue-600 bg-blue-100',
    pending: 'text-yellow-600 bg-yellow-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
