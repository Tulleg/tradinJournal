import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { getTradeCount } from '../services/api';

const Dashboard = () => {
  const [tradeCount, setTradeCount] = useState(0);

  useEffect(() => {
    const fetchTradeCount = async () => {
      try {
        const count = await getTradeCount();
        setTradeCount(count);
      } catch (error) {
        console.error('Fehler beim Abrufen der Trade-Anzahl:', error);
      }
    };
    fetchTradeCount();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Willkommen im Trading Journal</Typography>
      </Grid>
      <Grid item xs={6}>
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <Typography variant="h6">Trades:</Typography>
          <Typography variant="body1">{tradeCount}</Typography>
          <Link to="/trades">Zu den Trades</Link>
        </Paper>
      </Grid>
      {/* ... Rest der Komponente */}
    </Grid>
  );
};

export default Dashboard;
