const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Guest API
  async getGuests() {
    return this.request('/guests');
  }

  async getGuest(id) {
    return this.request(`/guests/${id}`);
  }

  async createGuest(guest) {
    return this.request('/guests', {
      method: 'POST',
      body: JSON.stringify(guest),
    });
  }

  async updateGuest(id, guest) {
    return this.request(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guest),
    });
  }

  async deleteGuest(id) {
    return this.request(`/guests/${id}`, {
      method: 'DELETE',
    });
  }

  async getGuestStats() {
    return this.request('/guests/stats');
  }

  // Expense API
  async getExpenses() {
    return this.request('/expenses');
  }

  async getExpense(id) {
    return this.request(`/expenses/${id}`);
  }

  async createExpense(expense) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id, expense) {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseStats() {
    return this.request('/expenses/stats');
  }

  // Food API
  async getFoodItems() {
    return this.request('/food');
  }

  async getFoodItem(id) {
    return this.request(`/food/${id}`);
  }

  async createFoodItem(foodItem) {
    return this.request('/food', {
      method: 'POST',
      body: JSON.stringify(foodItem),
    });
  }

  async updateFoodItem(id, foodItem) {
    return this.request(`/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodItem),
    });
  }

  async deleteFoodItem(id) {
    return this.request(`/food/${id}`, {
      method: 'DELETE',
    });
  }

  async getFoodStats() {
    return this.request('/food/stats');
  }

  // Location API
  async getLocations() {
    return this.request('/locations');
  }

  async getLocation(id) {
    return this.request(`/locations/${id}`);
  }

  async createLocation(location) {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async updateLocation(id, location) {
    return this.request(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  }

  async deleteLocation(id) {
    return this.request(`/locations/${id}`, {
      method: 'DELETE',
    });
  }

  async getLocationStats() {
    return this.request('/locations/stats');
  }

  // Import/Export API
  async getSampleData() {
    return this.request('/import-export/sample');
  }

  async importAllData(data) {
    return this.request('/import-export/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportAllData() {
    const response = await fetch(`${API_BASE_URL}/import-export/export`);
    if (!response.ok) {
      throw new Error('Export failed');
    }
    return response.blob();
  }

  async clearAllData() {
    return this.request('/import-export/clear', {
      method: 'DELETE',
    });
  }

  // Mapbox configuration API
  async getMapboxConfig() {
    return this.request('/mapbox/config');
  }
}

const apiService = new ApiService();
export default apiService;
