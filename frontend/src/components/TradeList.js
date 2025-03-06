import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import { getTrades, deleteTrade, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TradeList = ({ setIsAuthenticated }) => {
  const [trades, setTrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await getTrades();
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrade(id);
      fetchTrades();
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trade List
        </Typography>
        <Button onClick={handleLogout} variant="contained" color="secondary">
          Logout
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trade Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Profit/Loss</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade._id}>
                <TableCell>{trade.tradeNumber}</TableCell>
                <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>{trade.position}</TableCell>
                <TableCell>{trade.profitLoss}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(trade._id)} color="error" variant="outlined">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TradeList;
