# Todo App Frontend

Modern React.js frontend application with Material-UI components, JWT authentication, and responsive design. Features a complete user interface for todo management with real-time updates and professional styling.

## Overview

This frontend application provides a complete user interface for the Todo application, built with React.js and Material-UI. It features secure user authentication, real-time todo management, responsive design, and professional user experience with toast notifications and form validation.

## 🎨 Features

### User Interface
- **Modern Design**: Clean, professional interface using Material-UI components
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Toast Notifications**: User-friendly success and error messages
- **Loading States**: Visual feedback during API operations
- **Form Validation**: Client-side validation with real-time feedback

### Authentication
- **Secure Login/Signup**: JWT-based authentication with protected routes
- **Persistent Sessions**: Automatic token storage and retrieval
- **Route Protection**: Unauthorized users redirected to login
- **Auto-logout**: Session management with token expiration handling

### Todo Management
- **Real-time CRUD**: Create, read, update, delete operations with instant UI updates
- **Contextual State**: Global state management using React Context API
- **Optimistic Updates**: UI updates immediately with server sync
- **Error Recovery**: Graceful error handling with user feedback

## 🛠️ Technology Stack

### Core Framework
- **React 18+**: Latest React with concurrent features
- **React Router v6**: Modern routing with nested routes and layouts
- **React Context API**: Global state management without external dependencies

### UI & Styling
- **Material-UI (MUI)**: Comprehensive React component library
- **Custom CSS**: Tailored styles for authentication pages
- **Responsive Design**: Mobile-first approach with breakpoints
- **Icon Library**: Material Design icons for consistent iconography

### HTTP & API
- **Axios**: Promise-based HTTP client with interceptors
- **JWT Integration**: Automatic token attachment and refresh handling
- **Error Handling**: Centralized error handling with user notifications
- **Request/Response Interceptors**: Automatic authentication and logging

### Development Tools
- **Create React App**: Zero-configuration build setup
- **ESLint**: Code quality and consistency checking
- **React DevTools**: Browser extension for debugging React components

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- npm or yarn package manager
- Backend API running (see backend README)

### Installation

1. **Clone and Navigate**
```bash
git clone <repository-url>
cd todo-frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file in root directory:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# Optional: Development features
REACT_APP_ENABLE_LOGGING=true
```

4. **Start Development Server**
```bash
npm start
```

Application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Creates optimized production build in `build/` directory.

## 📱 Application Structure

### Page Components

#### Authentication Pages
- **Login Page** (`/login`): User authentication with email/password
- **Signup Page** (`/signup`): New user registration with validation
- **Protected Routes**: Automatic redirection for unauthenticated users

#### Main Application
- **Todo Dashboard** (`/`): Main application interface with todo list
- **Item Management**: Inline editing, deletion, and creation
- **User Profile**: Logout functionality and user information

### Component Architecture

```
src/
├── components/                 # Reusable UI components
│   ├── ProtectedRoute.js      # Route protection wrapper
│   └── common/                # Shared components
├── pages/                     # Page-level components
│   ├── Login.js               # Authentication page
│   ├── Login.css              # Login-specific styles
│   ├── Signup.js              # Registration page
│   └── Signup.css             # Signup-specific styles
├── context/                   # React Context providers
│   └── ItemsContext.js        # Todo items global state
├── config/                    # Configuration files
│   └── axiosConfig.js         # HTTP client setup
├── utils/                     # Utility functions
├── hooks/                     # Custom React hooks
└── App.js                     # Main application component
```

## 🔧 Configuration

### Environment Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `REACT_APP_API_URL` | string | Yes | Backend API base URL | http://localhost:3001 |
| `REACT_APP_ENV` | string | No | Environment identifier | development |
| `REACT_APP_ENABLE_LOGGING` | boolean | No | Enable request logging | true |

**Note**: All React environment variables must be prefixed with `REACT_APP_`

### API Configuration

#### Axios Setup (`config/axiosConfig.js`)
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

// Request interceptor for JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Routing Configuration

#### Protected Routes (`App.js`)
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ItemsProvider>
                <AppContent />
              </ItemsProvider>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎯 State Management

### React Context Implementation

#### Items Context (`context/ItemsContext.js`)
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../config/axiosConfig';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await API.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const response = await API.post('/items', item);
      setItems(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const response = await API.put(`/items/${id}`, updates);
      setItems(prev => prev.map(item => 
        item.id === id ? response.data : item
      ));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/items/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    items,
    loading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within ItemsProvider');
  }
  return context;
};
```

### State Flow
1. **Authentication State**: JWT token stored in localStorage
2. **Global State**: Todo items managed through Context API
3. **Local State**: Form inputs and UI state using useState
4. **Loading States**: API operation feedback for better UX

## 🎨 Styling & UI

### Material-UI Theme
```javascript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Responsive Design Breakpoints
```css
/* Mobile First Approach */
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Tablet */
@media (min-width: 768px) {
  .auth-paper {
    min-width: 400px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .auth-paper {
    min-width: 500px;
  }
}
```

### Component Styling Strategy
- **Material-UI Components**: Primary UI elements with consistent theming
- **Custom CSS**: Page-specific styles for authentication and layouts
- **Inline Styles**: Minimal usage for dynamic styles only
- **CSS Modules**: Considered for larger applications

## 🔐 Authentication Flow

### User Authentication Process

1. **Initial Load**
   - Check for existing JWT token in localStorage
   - Redirect to login if no valid token
   - Validate token with backend if present

2. **Login Process**
   ```javascript
   const handleLogin = async (credentials) => {
     try {
       const response = await API.post('/auth/login', credentials);
       localStorage.setItem('jwt_token', response.data.token);
       navigate('/');
       toast.success('Login successful!');
     } catch (error) {
       toast.error(error.response?.data?.error || 'Login failed');
     }
   };
   ```

3. **Registration Process**
   ```javascript
   const handleSignup = async (userData) => {
     try {
       await API.post('/auth/signup', userData);
       toast.success('Registration successful! Please login.');
       navigate('/login');
     } catch (error) {
       toast.error(error.response?.data?.error || 'Registration failed');
     }
   };
   ```

4. **Logout Process**
   ```javascript
   const handleLogout = () => {
     localStorage.removeItem('jwt_token');
     navigate('/login');
     toast.info('Logged out successfully');
   };
   ```

### Route Protection
```javascript
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
}
```

## 📱 User Experience Features

### Toast Notifications
```javascript
import { toast } from 'react-toastify';

// Success notifications
toast.success('Item created successfully!');

// Error notifications
toast.error('Failed to update item');

// Info notifications
toast.info('Please fill all required fields');

// Warning notifications
toast.warning('This action cannot be undone');
```

### Form Validation

#### Client-Side Validation
```javascript
const validateForm = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }
  
  if (data.description?.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  return errors;
};
```

#### Real-Time Validation
```javascript
const [errors, setErrors] = useState({});

const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  try {
    await addItem(data);
    toast.success('Item added successfully!');
  } catch (error) {
    toast.error('Failed to add item');
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testing & Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (irreversible)
npm run eject

# Analyze bundle size
npm run analyze
```

### Development Tools

#### React DevTools
- Install browser extension for component debugging
- Inspect component state and props
- Monitor Context API state changes
- Profile component performance

#### Browser Developer Tools
```javascript
// Debug API calls
console.log('API Request:', config);
console.log('API Response:', response.data);

// Debug state changes
useEffect(() => {
  console.log('Items updated:', items);
}, [items]);
```

### Testing Strategy

#### Component Testing
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('submits form with valid data', async () => {
  const user = userEvent.setup();
  render(<Login />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  // Assert expected behavior
});
```

#### Integration Testing
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('full authentication flow', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Test complete user flow
});
```

## 🚀 Deployment

### Build Configuration

#### Production Build
```bash
npm run build
```

Creates optimized production build:
- Minified JavaScript and CSS
- Optimized images and assets
- Service worker for caching
- Build analysis and optimization

#### Environment-Specific Builds
```bash
# Development build
REACT_APP_ENV=development npm run build

# Staging build
REACT_APP_ENV=staging npm run build

# Production build
REACT_APP_ENV=production npm run build
```

### Deployment Platforms

#### Vercel Deployment
1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings automatically

2. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-api.com
   REACT_APP_ENV=production
   ```

3. **Deploy Commands**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from local
   vercel --prod
   ```

#### Netlify Deployment
1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Redirects Configuration** (`public/_redirects`)
   ```
   /*    /index.html   200
   ```

3. **Environment Variables**
   Set in Netlify dashboard or via CLI

#### AWS S3 + CloudFront
1. **S3 Bucket Setup**
   - Create S3 bucket for static hosting
   - Enable public read access
   - Configure index.html as default

2. **CloudFront Distribution**
   - Create distribution pointing to S3
   - Configure custom error pages
   - Set up SSL certificate

### Performance Optimization

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze production bundle
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

#### Code Splitting
```javascript
import React, { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

#### Performance Best Practices
- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize re-renders with useCallback and useMemo
- Lazy load routes and heavy components
- Optimize images and assets

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Verify backend CORS configuration matches frontend URL

#### Token Expiration
```
403 Forbidden: Token expired
```
**Solution**: Implement token refresh or redirect to login

#### Build Failures
```
Module not found: Can't resolve './component'
```
**Solution**: Check import paths and file extensions

#### Performance Issues
```
Warning: Can't perform a React state update on an unmounted component
```
**Solution**: Clean up effects and cancel API requests

### Debug Checklist
1. **Environment Variables**: Verify all REACT_APP_ variables are set
2. **API Connectivity**: Test backend endpoints independently
3. **Authentication**: Check token storage and transmission
4. **State Management**: Verify Context providers wrap components
5. **Routing**: Confirm route protection and navigation logic

### Development Best Practices
- Use React Developer Tools for debugging
- Implement error boundaries for production
- Add comprehensive logging for API interactions
- Test on multiple browsers and devices
- Monitor performance with Lighthouse

## 📚 Dependencies

### Production Dependencies
```json
{
  "@mui/material": "^5.13.0",
  "@mui/icons-material": "^5.13.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.0",
  "axios": "^1.4.0",
  "react-toastify": "^9.1.0"
}
```

### Development Dependencies
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.0",
  "@testing-library/user-event": "^14.4.0",
  "react-scripts": "5.0.1"
}
```
## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style Guidelines
- Use functional components with hooks
- Follow React best practices and patterns
- Maintain consistent naming conventions
- Add PropTypes for component props
- Write clear, descriptive comments

### Pull Request Guidelines
- Include description of changes
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers