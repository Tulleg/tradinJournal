// TradeList.js
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTradeForm from './AddTradeForm';
import EditTradeForm from './EditTradeForm';
import { getTrades, deleteTrade } from '../services/api';

const TradeList = () => {
  const [trades, setTrades] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);



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
    setAddFormOpen(!addFormOpen);
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
    setAddFormOpen(false);
  };
  

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };

  const handleCheckboxChange = (event, tradeId) => {
    if (event.target.checked) {
      setSelectedTrades([...selectedTrades, tradeId]);
    } else {
      setSelectedTrades(selectedTrades.filter(id => id !== tradeId));
    }
  };
  
  

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedTrades.map(id => deleteTrade(id)));
      fetchTrades();
      setSelectedTrades([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Fehler beim Löschen der Trades:', error);
    }
  };
  

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Trade Liste
      </Typography>
      <Button variant="contained" color="primary" onClick={toggleAddForm} style={{ marginBottom: '20px', marginRight: '10px' }}>
        {showAddForm ? 'Formular schließen' : 'Neuen Trade hinzufügen'}
      </Button>
      {selectedTrades.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteSelected}
          style={{ marginBottom: '20px' }}
        >
          Ausgewählte löschen ({selectedTrades.length})
        </Button>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedTrades(trades.map(t => t._id));
                    } else {
                      setSelectedTrades([]);
                    }
                  }}
                  checked={selectedTrades.length === trades.length && trades.length > 0}
                  indeterminate={selectedTrades.length > 0 && selectedTrades.length < trades.length}
                />
              </TableCell>
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
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTrades.includes(trade._id)}
                    onChange={(event) => handleCheckboxChange(event, trade._id)}
                    onClick={(event) => event.stopPropagation()}
                  />
                </TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.tradeNumber || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.date ? new Date(trade.date).toLocaleDateString() : ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.symbol || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.model || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.bias || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.session || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.timeframe || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.confluences ? trade.confluences.join(', ') : ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.orderType || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.position || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.status || ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.slPips !== undefined ? trade.slPips : ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.riskPercentage !== undefined ? `${trade.riskPercentage}%` : ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.netPnL !== undefined ? trade.netPnL : ''}</TableCell>
                <TableCell onClick={() => handleRowClick(trade)} style={{ cursor: 'pointer' }}>{trade.maxRR !== undefined ? trade.maxRR : ''}</TableCell>
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
      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Trades löschen"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Sind Sie sicher, dass Sie die ausgewählten Trades löschen möchten?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
      Abbrechen
    </Button>
    <Button onClick={confirmDelete} color="primary" autoFocus>
      Löschen
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={addFormOpen}
  onClose={toggleAddForm}
  aria-labelledby="add-trade-dialog-title"
>
  <DialogTitle id="add-trade-dialog-title">Neuen Trade hinzufügen</DialogTitle>
  <DialogContent>
    <AddTradeForm onTradeAdded={handleTradeAdded} />
  </DialogContent>
  <DialogActions>
    <Button onClick={toggleAddForm} color="primary">
      Abbrechen
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default TradeList;
