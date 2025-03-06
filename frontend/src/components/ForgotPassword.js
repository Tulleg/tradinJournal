import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import { resetPasswordRequest } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPasswordRequest({ email });
      alert("Eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts wurde gesendet.");
    } catch (error) {
      console.error('Passwort-Reset-Anfrage fehlgeschlagen:', error);
      alert("Passwort-Reset-Anfrage fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4">Passwort vergessen</Typography>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Passwort zurücksetzen
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPassword;
