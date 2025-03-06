import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGoToTradeList = () => {
    navigate('/trades'); // Navigiert zur TradeList-Seite
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Willkommen im Trading Journal</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleGoToTradeList}>
          Zu den Trades
        </Button>
      </Grid>
      {/* Hier können weitere Dashboard-Elemente hinzugefügt werden */}
    </Grid>
  );
};

export default Dashboard;
