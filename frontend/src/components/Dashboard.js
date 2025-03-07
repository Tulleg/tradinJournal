import React, { useState, useEffect} from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { getTrades } from '../services/api';

const Dashboard = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Transformiere die Daten für das tägliche Diagramm
    const dailyChartData = trades
        .map((trade) => ({
            date: new Date(trade.date).toLocaleDateString(),
            netPnL: trade.netPnL || 0,
        }))
        .reduce((acc, curr) => {
            const existingEntry = acc.find((item) => item.date === curr.date);
            if (existingEntry) {
                existingEntry.netPnL += curr.netPnL;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [])
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Transformiere die Daten für das monatliche Diagramm
    const monthlyChartData = trades
        .map((trade) => ({
            date: new Date(trade.date),
            netPnL: trade.netPnL || 0,
        }))
        .reduce((acc, curr) => {
            const monthYear = `${curr.date.getFullYear()}-${(curr.date.getMonth() + 1).toString().padStart(2, '0')}`;
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
    const totalNetPnL = trades.reduce((acc, trade) => acc + (trade.netPnL || 0), 0);
    const totalTrades = trades.length;

    // Berechne den Profit Factor
    const grossProfit = trades.filter((trade) => (trade.netPnL > 0)).reduce((acc, trade) => acc + trade.netPnL, 0);
    const grossLoss = Math.abs(trades.filter((trade) => (trade.netPnL < 0)).reduce((acc, trade) => acc + trade.netPnL, 0));
    const profitFactor = grossLoss === 0 ? (grossProfit === 0 ? 0 : Infinity) : grossProfit / grossLoss;

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2c3e50' }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
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
                {/* Tägliches Diagramm */}
                <Grid item xs={12}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Tägliche Net Cumulative P&L
                            </Typography>
                            {loading ? (
                                <Typography>Lade Daten...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : dailyChartData && dailyChartData.length > 0 ? (
                                <LineChart width={730} height={250} data={dailyChartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="netPnL" stroke="#8884d8" />
                                </LineChart>
                            ) : (
                                <Typography>Keine Daten für das Diagramm verfügbar.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Monatliches Diagramm */}
                <Grid item xs={12}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Monatliche Net P&L
                            </Typography>
                            {loading ? (
                                <Typography>Lade Daten...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : monthlyChartData && monthlyChartData.length > 0 ? (
                                <BarChart width={730} height={250} data={monthlyChartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="monthYear" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="netPnL" fill="#82ca9d" />
                                </BarChart>
                            ) : (
                                <Typography>Keine Daten für das Diagramm verfügbar.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
