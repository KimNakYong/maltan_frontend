// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Redux Store
import store from './store';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import CommunityPage from './pages/CommunityPage';
import CommunityWritePage from './pages/CommunityWritePage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import MapTestPage from './pages/MapTestPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import PlacesPage from './pages/admin/PlacesPage';
import AdminCommunityPage from './pages/admin/CommunityPage';
import StatisticsPage from './pages/admin/StatisticsPage';
import LogsPage from './pages/admin/LogsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Components
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4569',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute requireAdmin>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="places" element={<PlacesPage />} />
                <Route path="community" element={<AdminCommunityPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* User Routes */}
              <Route path="/*" element={<Layout><Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/place/:id" element={<PlaceDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/write" element={
                  <PrivateRoute>
                    <CommunityWritePage />
                  </PrivateRoute>
                } />
                <Route path="/community/:id" element={<CommunityDetailPage />} />
                <Route path="/map-test" element={<MapTestPage />} />

                {/* Private Routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes></Layout>} />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

