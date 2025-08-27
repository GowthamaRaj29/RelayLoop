# RelayLoop Hospital Readmission Prediction Frontend - Complete File Structure

This document provides a comprehensive overview of all files and folders in the RelayLoop frontend project, ensuring that the names match exactly with those used in the code.

## Project Root Structure

```
relayloop/
├── .env                      # Environment variables (Supabase config)
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML template
├── package.json             # npm dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite build configuration
├── public/                  # Static assets
│   └── relyloop.svg        # Logo file
└── src/                     # Source code directory
    ├── assets/              # Asset files (images, fonts, etc.)
    ├── components/          # React components
    │   ├── ui/             # UI components (buttons, inputs, etc.)
    │   ├── layout/         # Layout components (headers, sidebars, etc.)
    │   └── forms/          # Form components
    │       └── LoginForm.jsx
    ├── context/             # React context providers
    │   └── AuthContext.jsx
    ├── hooks/               # Custom React hooks
    │   └── useAuth.js
    ├── lib/                 # Utility libraries and configurations
    │   └── supabase.js
    ├── pages/               # Page components
    │   └── Login.jsx
    ├── routes/              # Routing configuration
    │   ├── PrivateRoute.jsx
    │   └── index.jsx
    ├── App.css              # App-level styles
    ├── App.jsx              # Main App component
    ├── index.css            # Global styles with Tailwind imports
    └── main.jsx             # Application entry point
```

## File Descriptions

### Configuration Files

- **`.env`** - Contains environment variables for Supabase configuration and app settings
- **`tailwind.config.js`** - Tailwind CSS configuration with custom theme settings
- **`vite.config.js`** - Vite build tool configuration with React and Tailwind plugins
- **`eslint.config.js`** - ESLint configuration for code quality and linting rules
- **`package.json`** - npm package configuration with dependencies and scripts

### Core Application Files

- **`src/main.jsx`** - Application entry point that renders the App component
- **`src/App.jsx`** - Main application component with Router and AuthProvider setup
- **`src/index.css`** - Global CSS styles with Tailwind CSS imports

### Authentication System

- **`src/lib/supabase.js`** - Supabase client configuration and auth helper functions
- **`src/context/AuthContext.jsx`** - Authentication context provider for app-wide auth state
- **`src/hooks/useAuth.js`** - Custom hook to access authentication context

### Components

- **`src/components/forms/LoginForm.jsx`** - Login form component with validation using react-hook-form and zod

### Pages

- **`src/pages/Login.jsx`** - Login page component that handles authentication and role-based redirects

### Routing

- **`src/routes/index.jsx`** - Main routing configuration with protected routes
- **`src/routes/PrivateRoute.jsx`** - Protected route component that checks authentication and role permissions

### Directory Structure Details

#### Empty Directories (Ready for Future Components)
- **`src/assets/`** - For storing images, fonts, and other static assets
- **`src/components/ui/`** - For reusable UI components like buttons, inputs, modals
- **`src/components/layout/`** - For layout components like headers, sidebars, navigation

#### Existing Files with Functionality

All files have been implemented with the exact names and imports as specified in the original documentation, ensuring:

1. **Consistent naming**: All file and folder names match exactly with import statements
2. **Proper imports**: All components use the correct relative import paths
3. **Role-based routing**: Authentication system supports admin, doctor, and nurse roles
4. **Production-ready**: Code follows React best practices with proper error handling
5. **Tailwind integration**: Styled with Tailwind CSS for responsive design

## Import Statements Verification

The following import statements are used throughout the application, confirming the correct file structure:

```javascript
// From Login.jsx
import LoginForm from '../components/forms/LoginForm';

// From AuthContext.jsx
import { supabase, getUserRole } from '../lib/supabase';

// From LoginForm.jsx
import { useAuth } from '../../hooks/useAuth';

// From PrivateRoute.jsx
import { useAuth } from '../hooks/useAuth';

// From App.jsx
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
```

All paths and names have been verified to match the documented structure exactly.