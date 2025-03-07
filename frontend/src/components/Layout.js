// Layout.js
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton,Button, ListItemIcon, ListItemText, Toolbar, Typography, AppBar, IconButton } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout'; // Importiere das Logout-Icon
import { useAuth } from '../context/AuthContext'; // Importiere useAuth
const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Hole die logout-Funktion aus dem AuthContext

  const handleLogout = () => {
      logout();
      navigate('/login'); // Navigiere zur Login-Seite nach dem Ausloggen
  };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar (Header) */}
            <AppBar
                position="fixed"
                sx={{
                  width: `calc(100% - ${drawerWidth}px)`,
                  ml: `${drawerWidth}px`,
                  backgroundColor: '#2c3e50',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start', // Startausrichtung
                  alignItems: 'center',
                  paddingRight: 2,
                }}
            >
                <Toolbar sx={{
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between', // Verteilt den Platz zwischen den Elementen
    alignItems: 'center',
}}>
                    <Typography variant="h6" noWrap component="div" >
                        Trading Journal
                    </Typography>
                </Toolbar>
                <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ ml: 'auto' }} // Schiebt den Button nach rechts
                >
                    Logout
                </Button>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#34495e',
                        color: 'white'
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <List>
                    <ListItem key="AddTrade">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => navigate('/addtrade')}
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#e74c3c',
                                '&:hover': {
                                    backgroundColor: '#c0392b',
                                },
                                color: 'white'
                            }}
                        >
                            Add Trade
                        </Button>
                    </ListItem>
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
                    //ml: `${drawerWidth}px`,
                    mt: '64px', // Höhe der AppBar
                    backgroundColor: '#f0f0f0',
                    minHeight: '100vh',
                    display: 'flex', // Aktiviert Flexbox
                    justifyContent: 'center', // Zentriert horizontal
                    alignItems: 'flex-start', // Zentriert vertikal (falls nötig)
                    
                }}
            >
            <Box sx={{ width: '100%', maxWidth: 1400 }}> {/* Begrenzte Breite für den Inhalt */}
                <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
