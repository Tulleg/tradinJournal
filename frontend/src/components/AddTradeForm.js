import React, { useState } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Grid } from '@mui/material';
import { createTrade } from '../services/api';

const AddTradeForm = ({ onTradeAdded }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    model: '',
    bias: '',
    session: '',
    timeframe: '',
    confluences: '',
    orderType: '',
    position: '',
    status: '',
    date: '',
    slPips: 0,
    riskPercentage: 0,
    netPnL: 0,
    maxRR: 0,
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrade({
        ...formData,
        confluences: formData.confluences.split(',').map((item) => item.trim()),
      });
      
      // Rufe onTradeAdded auf, um die Tradelist zu aktualisieren und das Fenster zu schließen
      if (onTradeAdded) onTradeAdded();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Trades:', error);
      alert('Fehler beim Hinzufügen des Trades.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Neuen Trade hinzufügen
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Bias"
              name="bias"
              value={formData.bias}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Bullish">Bullish</MenuItem>
              <MenuItem value="Bearish">Bearish</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="London">London</MenuItem>
              <MenuItem value="NY">NY</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Timeframe"
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Confluences (kommagetrennt)"
              name="confluences"
              value={formData.confluences}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Order Type"
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Buy">Buy</MenuItem>
              <MenuItem value="Sell">Sell</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Closed by Stoploss">Closed by Stoploss</MenuItem>
              <MenuItem value="Closed manually">Closed manually</MenuItem>
              <MenuItem value="Closed by TP">Closed by TP</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Datum"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="SL Pips"
              name="slPips"
              type="number"
              value={formData.slPips}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Risk Percentage"
              name="riskPercentage"
              type="number"
              value={formData.riskPercentage}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Net PnL"
              name="netPnL"
              type="number"
              value={formData.netPnL}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Max R/R"
              name="maxRR"
              type="number"
              value={formData.maxRR}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
              Trade hinzufügen
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddTradeForm;
