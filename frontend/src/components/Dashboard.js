import React, { useState, useEffect} from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Chart, registerables } from 'chart.js';
import { getTrades } from '../services/api';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { DailyChart, MonthlyChart } from './ChartComponents'; // Importiere die Chart-Komponenten

Chart.register(...registerables);

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Entferne die Chart-Ref Hooks
    const [startDate, setStartDate] = useState(DateTime.now().minus({ months: 1 }).toFormat('yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
    // Entferne die Chart-Instanz Hooks
    const [openDialog, setOpenDialog] = useState(null);

    useEffect(() => {
        const fetchTradesData = async () => {
            setLoading(true);
            try {
                const response = await getTrades();
                setTrades(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Trades:', error);
                setError('Fehler beim Laden der Trades. Bitte versuchen Sie es später erneut.');
            } finally {
                setLoading(false);
            }
        };

        fetchTradesData();
    }, []);

    const filteredTrades = trades.filter(trade => {
        const tradeDate = DateTime.fromISO(trade.date);
        const start = DateTime.fromISO(startDate);
        const end = DateTime.fromISO(endDate);
        return tradeDate >= start && tradeDate <= end;
    });

    const dailyChartData = filteredTrades
        .map((trade) => ({
            date: DateTime.fromISO(trade.date),
            netPnL: trade.netPnL || 0,
        }))
        .reduce((acc, curr) => {
            const dateString = curr.date.toFormat('yyyy-MM-dd');
            const existingEntry = acc.find((item) => item.date.toFormat('yyyy-MM-dd') === dateString);
            if (existingEntry) {
                existingEntry.netPnL += curr.netPnL;
            } else {
                acc.push({ date: curr.date, netPnL: curr.netPnL });
            }
            return acc;
        }, [])
        .sort((a, b) => a.date - b.date);

    const monthlyChartData = filteredTrades
        .map((trade) => ({
            date: DateTime.fromISO(trade.date),
            netPnL: trade.netPnL || 0,
        }))
        .reduce((acc, curr) => {
            const monthYear = curr.date.toFormat('yyyy-MM');
            const existingEntry = acc.find((item) => item.monthYear === monthYear);
            if (existingEntry) {
                existingEntry.netPnL += curr.netPnL;
            } else {
                acc.push({ monthYear, netPnL: curr.netPnL });
            }
            return acc;
        }, [])
        .sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Berechne die gesamte Net P&L und die Anzahl der Trades
    const totalNetPnL = filteredTrades.reduce((acc, trade) => acc + (trade.netPnL || 0), 0);
    const totalTrades = filteredTrades.length;

    // Berechne den Profit Factor
    const grossProfit = filteredTrades.filter((trade) => (trade.netPnL > 0)).reduce((acc, trade) => acc + trade.netPnL, 0);
    const grossLoss = Math.abs(filteredTrades.filter((trade) => (trade.netPnL < 0)).reduce((acc, trade) => acc + trade.netPnL, 0));
    const profitFactor = grossLoss === 0 ? (grossProfit === 0 ? 0 : Infinity) : grossProfit / grossLoss;

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleOpenDialog = (chartType) => {
        setOpenDialog(chartType);
    };

    const handleCloseDialog = () => {
        setOpenDialog(null);
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2c3e50' }}>
                Dashboard
            </Typography>
            <Grid container spacing={3} alignItems="center">
                {/* Statistik-Karten */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Total Net P&L
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                ${totalNetPnL.toFixed(2)}
                            </Typography>
                            <Typography sx={{ color: '#7f8c8d' }}>
                                Trades in total: {totalTrades}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Profit Factor
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                {profitFactor.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Datumsauswahl */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        defaultValue={startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        defaultValue={endDate}
                        onChange={handleEndDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                {/* Tägliches Diagramm */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Tägliche Net Cumulative P&L
                            </Typography>
                            {loading ? (
                                <Typography>Lade Daten...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : (
                                <Box sx={{ position: 'relative' }}>
                                    {/* Verwende die DailyChart-Komponente */}
                                    <DailyChart chartData={dailyChartData} />
                                    <IconButton
                                        aria-label="vergrößern"
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                        onClick={() => handleOpenDialog('daily')}
                                    >
                                        <OpenInFullIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Monatliches Diagramm */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Monatliche Net P&L
                            </Typography>
                            {loading ? (
                                <Typography>Lade Daten...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : (
                                <Box sx={{ position: 'relative' }}>
                                    {/* Verwende die MonthlyChart-Komponente */}
                                    <MonthlyChart chartData={monthlyChartData} />
                                    <IconButton
                                        aria-label="vergrößern"
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                        onClick={() => handleOpenDialog('monthly')}
                                    >
                                        <OpenInFullIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialog für vergrößerte Ansicht */}
            <Dialog open={openDialog !== null} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>{openDialog === 'daily' ? 'Tägliche Net Cumulative P&L' : 'Monatliche Net P&L'}</DialogTitle>
                <DialogContent>
                    {openDialog === 'daily' && (
                        <DailyChart chartData={dailyChartData} />
                    )}
                    {openDialog === 'monthly' && (
                        <MonthlyChart chartData={monthlyChartData} />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
