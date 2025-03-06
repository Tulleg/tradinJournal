import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link, Alert } from '@mui/material';
import { login } from '../services/api';
import { Link as RouterLink } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Typography align="center" sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/register">
          Noch kein Konto? Registrieren
        </Link>
      </Typography>
      <Typography align="center" sx={{ mt: 1 }}>
        <Link component={RouterLink} to="/forgot-password">
          Passwort vergessen?
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
