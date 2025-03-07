import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Chart, registerables } from 'chart.js';
import { getTrades } from '../services/api';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

Chart.register(...registerables);

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dailyChartRef = useRef(null);
    const monthlyChartRef = useRef(null);
    const dailyDialogChartRef = useRef(null);
    const monthlyDialogChartRef = useRef(null);
    const [startDate, setStartDate] = useState(DateTime.now().minus({ months: 1 }).toFormat('yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
    const dailyChartInstance = useRef(null);
    const monthlyChartInstance = useRef(null);
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

    useEffect(() => {
        if (trades.length > 0) {
            createDailyChart();
            createMonthlyChart();
        }

        return () => {
            if (dailyChartInstance.current) {
                dailyChartInstance.current.destroy();
            }
            if (monthlyChartInstance.current) {
                monthlyChartInstance.current.destroy();
            }
        };
    }, [trades, startDate, endDate]);

    const filteredTrades = trades.filter(trade => {
        const tradeDate = DateTime.fromISO(trade.date);
        const start = DateTime.fromISO(startDate);
        const end = DateTime.fromISO(endDate);
        return tradeDate >= start && tradeDate <= end;
    });

    const createDailyChart = useCallback(() => {
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

        const ctx = dailyChartRef.current?.getContext('2d');
        if (!ctx) return;

        if (dailyChartInstance.current) {
            dailyChartInstance.current.destroy();
        }

        dailyChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyChartData.map(data => data.date.toFormat('yyyy-MM-dd')),
                datasets: [{
                    label: 'Daily Net P&L',
                    data: dailyChartData.map(data => data.netPnL),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'yyyy-MM-dd'
                            }
                        },
                        ticks: {
                            source: 'data'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [filteredTrades]);

    const createMonthlyChart = useCallback(() => {
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

        const ctx = monthlyChartRef.current?.getContext('2d');
        if (!ctx) return;

        if (monthlyChartInstance.current) {
            monthlyChartInstance.current.destroy();
        }

        monthlyChartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyChartData.map(data => data.monthYear),
                datasets: [{
                    label: 'Monthly Net P&L',
                    data: monthlyChartData.map(data => data.netPnL),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [filteredTrades]);

    const createDialogChart = useCallback((chartType) => {
        const chartData = chartType === 'daily' ? filteredTrades.map(trade => ({
            date: DateTime.fromISO(trade.date),
            netPnL: trade.netPnL || 0,
        })).reduce((acc, curr) => {
            const dateString = curr.date.toFormat('yyyy-MM-dd');
            const existingEntry = acc.find((item) => item.date.toFormat('yyyy-MM-dd') === dateString);
            if (existingEntry) {
                existingEntry.netPnL += curr.netPnL;
            } else {
                acc.push({ date: curr.date, netPnL: curr.netPnL });
            }
            return acc;
        }, []).sort((a, b) => a.date - b.date) : filteredTrades.map(trade => ({
            date: DateTime.fromISO(trade.date),
            netPnL: trade.netPnL || 0,
        })).reduce((acc, curr) => {
            const monthYear = curr.date.toFormat('yyyy-MM');
            const existingEntry = acc.find((item) => item.monthYear === monthYear);
            if (existingEntry) {
                existingEntry.netPnL += curr.netPnL;
            } else {
                acc.push({ monthYear, netPnL: curr.netPnL });
            }
            return acc;
        }, []).sort((a, b) => a.monthYear.localeCompare(b.monthYear));

        const canvasRef = chartType === 'daily' ? dailyDialogChartRef : monthlyDialogChartRef;
        const chartTypeForChart = chartType === 'daily' ? 'line' : 'bar';

        const dialogCtx = canvasRef.current?.getContext('2d');
        if (!dialogCtx) return;

        new Chart(dialogCtx, {
            type: chartTypeForChart,
            data: {
                labels: chartData.map(data => chartType === 'daily' ? data.date.toFormat('yyyy-MM-dd') : data.monthYear),
                datasets: [{
                    label: chartType === 'daily' ? 'Daily Net P&L' : 'Monthly Net P&L',
                    data: chartData.map(data => data.netPnL),
                    borderColor: chartType === 'daily' ? 'rgb(75, 192, 192)' : undefined,
                    backgroundColor: chartType === 'monthly' ? 'rgba(75, 192, 192, 0.6)' : undefined,
                    tension: chartType === 'daily' ? 0.1 : undefined,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'yyyy-MM-dd'
                            }
                        },
                        ticks: {
                            source: 'data'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
            }
        });
    }, [filteredTrades]);

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
        // Erstelle das Chart erst, wenn der Dialog geöffnet wird
        setTimeout(() => {
            createDialogChart(chartType);
        }, 0);
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
                                    <canvas ref={dailyChartRef} height="300" />
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
                                    <canvas ref={monthlyChartRef} height="300" />
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
                        <canvas ref={dailyDialogChartRef} style={{ height: '500px', width: '100%' }} />
                    )}
                    {openDialog === 'monthly' && (
                        <canvas ref={monthlyDialogChartRef} style={{ height: '500px', width: '100%' }} />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
