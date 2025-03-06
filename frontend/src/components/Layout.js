// Layout.js
import React from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, AppBar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // Icon für "Add Trade" Button
import DashboardIcon from '@mui/icons-material/Dashboard'; // Icon für Dashboard
import ListAltIcon from '@mui/icons-material/ListAlt'; // Icon für Trade Log
/*import AssessmentIcon from '@mui/icons-material/Assessment'; // Icon für Reports
import InsightsIcon from '@mui/icons-material/Insights'; // Icon für Insights
import SchoolIcon from '@mui/icons-material/School'; // Icon für University
import BookIcon from '@mui/icons-material/Book'; // Icon für Notebook*/

const drawerWidth = 240;

const Layout = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar (Header) */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    backgroundColor: '#2c3e50' // Dunkelblaue Farbe
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Trading Journal
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#34495e', // Dunkelgraue Farbe
                        color: 'white' // Schriftfarbe
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List>
                    {/* Button zum Hinzufügen eines Trades */}
                    <ListItem key="AddTrade">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => navigate('/addtrade')}
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#e74c3c', // Rot
                                '&:hover': {
                                    backgroundColor: '#c0392b', // Dunkleres Rot beim Hover
                                },
                                color: 'white'
                            }}
                        >
                            Add Trade
                        </Button>
                    </ListItem>
                    {/* Navigationslinks */}
                    <ListItem key="Dashboard" disablePadding>
                        <ListItemButton onClick={() => navigate('/dashboard')}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="Trade Log" disablePadding>
                        <ListItemButton onClick={() => navigate('/tradelog')}>
                            <ListItemIcon sx={{ color: 'white' }}>
                                <ListAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Trade Log" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: `${drawerWidth}px`,
                    mt: '64px', // Höhe der AppBar
                    backgroundColor: '#ecf0f1', // Hellgrau für den Hintergrund
                    minHeight: '100vh', // Mindesthöhe, um den gesamten Viewport abzudecken
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
