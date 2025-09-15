# Contributing to Wedding Management System

Thank you for your interest in contributing to the Wedding Management System! 🎉

This document provides guidelines and information for contributors. Please read it carefully before making any contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Community Guidelines](#community-guidelines)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com](mailto:your-email@example.com).

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**
- A **GitHub account**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Wedding-Management-System.git
   cd Wedding-Management-System
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/markprop/Wedding-Management-System.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install-all

# Or install separately
npm run install-backend
npm run install-frontend
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
MAPBOX_ACCESS_TOKEN=your_mapbox_token
PORT=5000
NODE_ENV=development
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

The application will be available at `http://localhost:3000`

## 🔄 How to Contribute

### 1. Choose an Issue

- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to express your interest
- Wait for maintainer approval before starting work

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run all tests
npm run test

# Run backend tests only
cd backend && npm test

# Run frontend tests only
cd frontend && npm test
```

### 5. Commit Your Changes

```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new guest filtering functionality

- Add search by name and phone number
- Implement category-based filtering
- Update UI with filter controls
- Add tests for new functionality

Closes #123"
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Self-review of your code has been performed
- [ ] Code has been commented, particularly in hard-to-understand areas
- [ ] Tests have been added/updated and all tests pass
- [ ] Documentation has been updated accordingly
- [ ] No merge conflicts with the main branch

### Pull Request Template

When creating a PR, please include:

1. **Description**: What changes were made and why
2. **Type of Change**: Bug fix, new feature, documentation, etc.
3. **Testing**: How the changes were tested
4. **Screenshots**: If applicable, include screenshots
5. **Checklist**: Confirm all requirements are met

### Review Process

1. **Automated Checks**: CI/CD pipeline will run tests
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## 📏 Coding Standards

### JavaScript/React

- Use **ES6+** features
- Follow **functional programming** principles
- Use **const** and **let** instead of **var**
- Use **arrow functions** for callbacks
- Use **template literals** for string concatenation

```javascript
// ✅ Good
const handleSubmit = async (formData) => {
  try {
    const response = await api.createGuest(formData);
    setGuests(prev => [...prev, response.data]);
  } catch (error) {
    console.error('Error creating guest:', error);
  }
};

// ❌ Bad
function handleSubmit(formData) {
  api.createGuest(formData).then(response => {
    setGuests(guests.concat(response.data));
  }).catch(error => {
    console.error('Error creating guest:', error);
  });
}
```

### Component Structure

```jsx
// ✅ Good component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const GuestModal = ({ isOpen, onClose, guest, onSubmit }) => {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (guest) {
      setFormData(guest);
    }
  }, [guest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {/* Modal content */}
    </div>
  );
};

GuestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  guest: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default GuestModal;
```

### CSS/Styling

- Use **Tailwind CSS** classes
- Follow **mobile-first** approach
- Use **semantic class names**
- Keep styles **consistent** across components

```jsx
// ✅ Good Tailwind usage
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Guest Management</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
    Add Guest
  </button>
</div>
```

### File Naming

- **Components**: PascalCase (e.g., `GuestModal.jsx`)
- **Utilities**: camelCase (e.g., `formatters.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

## 🧪 Testing

### Backend Testing

```javascript
// Example test structure
const request = require('supertest');
const app = require('../server');

describe('Guest API', () => {
  test('GET /api/guests should return all guests', async () => {
    const response = await request(app)
      .get('/api/guests')
      .expect(200);
    
    expect(response.body).toHaveProperty('guests');
    expect(Array.isArray(response.body.guests)).toBe(true);
  });
});
```

### Frontend Testing

```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import GuestModal from '../GuestModal';

describe('GuestModal', () => {
  test('renders modal when isOpen is true', () => {
    render(<GuestModal isOpen={true} onClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- **Comment complex logic**
- **Document API endpoints**
- **Explain business logic**
- **Update README when needed**

```javascript
/**
 * Calculates the net pawo contribution for a guest
 * @param {Object} pawo - Pawo object with upper, awoto, banodo
 * @returns {number} Net contribution amount
 */
const calculateNetPawo = (pawo) => {
  // Upper is direct contribution
  // Previous amount equals awoto (they cancel each other out)
  // Net contribution = upper amount
  return pawo.upper || 0;
};
```

### API Documentation

Update API documentation in the README when adding new endpoints:

```markdown
### New Endpoint
- `POST /api/guests/search` - Search guests by criteria
  - Body: `{ name: string, phone: string, attending: boolean }`
  - Response: `{ guests: Guest[], total: number }`
```

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the bug
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** if applicable
6. **Environment details** (OS, browser, Node version)

### Feature Requests

When requesting features, please include:

1. **Clear description** of the feature
2. **Use case** and motivation
3. **Proposed solution**
4. **Alternatives considered**
5. **Additional context**

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 🌟 Community Guidelines

### Getting Help

- **GitHub Discussions** for questions and general discussion
- **GitHub Issues** for bug reports and feature requests
- **Pull Requests** for code contributions

### Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub** contributor statistics

### Mentorship

- Experienced contributors are encouraged to mentor newcomers
- Look for issues labeled `good first issue`
- Be patient and helpful in code reviews

## 📞 Contact

- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **GitHub**: [@markprop](https://github.com/markprop)
- **Discussions**: [GitHub Discussions](https://github.com/markprop/Wedding-Management-System/discussions)

## 🙏 Thank You

Thank you for contributing to the Wedding Management System! Your contributions help make wedding planning easier for couples around the world. 💒✨

---

**Happy Contributing! 🎉**
