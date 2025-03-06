import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getTrades, deleteTrade } from '../services/api';

const TradeList = () => {
  const [trades, setTrades] = useState([]);

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

  return (
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
                <Button onClick={() => handleDelete(trade._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeList;
