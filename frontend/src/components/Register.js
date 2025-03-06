import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import { register } from '../services/api';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }
    try {
      await register({ email, password });
      alert("Registrierung erfolgreich! Bitte loggen Sie sich ein.");
      history.push('/login');
    } catch (error) {
      console.error('Registrierung fehlgeschlagen:', error);
      alert("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Registrierung</Typography>
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
          label="Passwort"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Passwort bestätigen"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrieren
        </Button>
      </form>
    </Container>
  );
};

export default Register;
