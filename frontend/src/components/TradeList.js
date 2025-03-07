// TradeList.js
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogContent, DialogTitle, Checkbox, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTradeForm from './AddTradeForm';
import EditTradeForm from './EditTradeForm';
import { getTrades, deleteTrade } from '../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';

const TradeList = () => {
    const [tradesLocal, setTradesLocal] = useState([]); // Lokaler State für Trades
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [selectedTrades, setSelectedTrades] = useState([]);
    const navigate = useNavigate();

    // Versuche den Kontext zu verwenden (falls vorhanden)
    const context = useOutletContext() || {};
    const trades = context.trades || tradesLocal;
    const setTrades = context.setTrades || setTradesLocal;

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const response = await getTrades();
            setTrades(response.data); // Aktualisiere entweder den Kontext oder den lokalen State
        } catch (error) {
            console.error('Fehler beim Abrufen der Trades:', error);
        }
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

   const handleRowClick = (trade) => {
    console.log('Clicked trade:', trade); // Überprüfen, ob der Trade vorhanden ist
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

    const handleCheckboxChange = (event, tradeId) => {
        if (event.target.checked) {
            setSelectedTrades([...selectedTrades, tradeId]);
        } else {
            setSelectedTrades(selectedTrades.filter(id => id !== tradeId));
        }
    };

    const handleDeleteSelected = async () => {
        if (window.confirm('Sind Sie sicher, dass Sie die ausgewählten Trades löschen möchten?')) {
            try {
                await Promise.all(selectedTrades.map(id => deleteTrade(id)));
                fetchTrades();
                setSelectedTrades([]);
            } catch (error) {
                console.error('Fehler beim Löschen der Trades:', error);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Trade Liste
            </Typography>
            <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/addtrade')}
                      >
                        + Add Trade
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
            {/* Tabelle */}
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
                        {trades.map((trade, index) => (
                            <TableRow
                                key={trade._id}
                                hover
                                onClick={() => handleRowClick(trade)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedTrades.includes(trade._id)}
                                        onChange={(event) => handleCheckboxChange(event, trade._id)}
                                        onClick={(event) => event.stopPropagation()}
                                    />
                                </TableCell>
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

            {/* Dialoge */}
            {showAddForm && (
                <Dialog open={showAddForm} onClose={toggleAddForm}>
                    {/* Add Form */}
                </Dialog>
            )}
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
        </Box>
    );
};

export default TradeList;
