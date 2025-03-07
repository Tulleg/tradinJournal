// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import Login from './components/Login';
import AddTradeForm from './components/AddTradeForm';
import EditTradeForm from './components/EditTradeForm';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// Funktionale Komponente für PrivateRoute
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const [trades, setTrades] = useState([]); // State für Trades und Setter

  return isAuthenticated ? (
    <Layout>
      {/* Bereitstellung des Outlet Context */}
      <Outlet context={{ trades, setTrades }} />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

// Default Theme erstellen
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Private Routen */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tradelog" element={<TradeList />} />
              <Route path="/addtrade" element={<AddTradeForm onTradeAdded={() => { }} />} />
              <Route path="/edittrade/:id" element={<EditTradeForm onTradeUpdated={() => { }} onCancel={() => { }} />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
