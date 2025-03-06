// Dashboard.js
import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const Dashboard = () => {
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
                                $7,674.45
                            </Typography>
                            <Typography sx={{ color: '#7f8c8d' }}>
                                Trades in total: 30
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Weitere Statistik-Karten hier */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Profit Factor
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                1.64
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Diagramm-Platzhalter */}
                <Grid item xs={12}>
                    <Card sx={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" component="h2" sx={{ color: '#34495e' }}>
                                Net Cumulative P&L
                            </Typography>
                            <Box sx={{ height: 300, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                                    Diagramm hier (Platzhalter)
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
