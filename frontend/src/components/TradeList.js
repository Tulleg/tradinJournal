import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogContent } from '@mui/material';
import AddTradeForm from './AddTradeForm';
import EditTradeForm from './EditTradeForm';
import { getTrades } from '../services/api';

const TradeList = () => {
  const [trades, setTrades] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await getTrades();
      setTrades(response.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Trades:', error);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleRowClick = (trade) => {
    setEditingTrade(trade);
  };

  const handleCloseEditDialog = () => {
    setEditingTrade(null);
  };

  const handleTradeUpdated = () => {
    fetchTrades();
    setEditingTrade(null);
  };

  const handleTradeAdded = () => {
    fetchTrades();
    setShowAddForm(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Trade Liste
      </Typography>
      <Button variant="contained" color="primary" onClick={toggleAddForm} style={{ marginBottom: '20px' }}>
        {showAddForm ? 'Formular schließen' : 'Neuen Trade hinzufügen'}
      </Button>
      {showAddForm && <AddTradeForm onTradeAdded={handleTradeAdded} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trade Nr.</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Bias</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>Timeframe</TableCell>
              <TableCell>Confluences</TableCell>
              <TableCell>Order Typ</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>SL Pips</TableCell>
              <TableCell>Risk %</TableCell>
              <TableCell>Net PnL</TableCell>
              <TableCell>Max R/R</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <TableRow 
                key={trade._id} 
                onClick={() => handleRowClick(trade)}
                style={{ cursor: 'pointer' }}
                hover
              >
                <TableCell>{trade.tradeNumber || ''}</TableCell>
                <TableCell>{trade.date ? new Date(trade.date).toLocaleDateString() : ''}</TableCell>
                <TableCell>{trade.symbol || ''}</TableCell>
                <TableCell>{trade.model || ''}</TableCell>
                <TableCell>{trade.bias || ''}</TableCell>
                <TableCell>{trade.session || ''}</TableCell>
                <TableCell>{trade.timeframe || ''}</TableCell>
                <TableCell>{trade.confluences ? trade.confluences.join(', ') : ''}</TableCell>
                <TableCell>{trade.orderType || ''}</TableCell>
                <TableCell>{trade.position || ''}</TableCell>
                <TableCell>{trade.status || ''}</TableCell>
                <TableCell>{trade.slPips !== undefined ? trade.slPips : ''}</TableCell>
                <TableCell>{trade.riskPercentage !== undefined ? `${trade.riskPercentage}%` : ''}</TableCell>
                <TableCell>{trade.netPnL !== undefined ? trade.netPnL : ''}</TableCell>
                <TableCell>{trade.maxRR !== undefined ? trade.maxRR : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editingTrade !== null} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogContent>
          {editingTrade && (
            <EditTradeForm
              trade={editingTrade}
              onTradeUpdated={handleTradeUpdated}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradeList;
