import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AddTradeForm from './AddTradeForm';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Willkommen im Trading Journal</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={toggleForm}>
          {showForm ? 'Formular schließen' : 'Neuen Trade hinzufügen'}
        </Button>
      </Grid>
      {showForm && (
        <Grid item xs={12}>
          <AddTradeForm />
        </Grid>
      )}
      {/* Hier können weitere Dashboard-Elemente hinzugefügt werden */}
    </Grid>
  );
};

export default Dashboard;
