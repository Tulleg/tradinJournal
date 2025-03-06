import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
      <List>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/add-trade')}
          >
            + Add Trade
          </Button>
        </ListItem>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/daily-stats')}>
          <ListItemText primary="Daily Stats" />
        </ListItem>
        <ListItem button onClick={() => navigate('/trade-log')}>
          <ListItemText primary="Trade Log" />
        </ListItem>
        
      </List>
    </Drawer>
  );
};

export default Sidebar;
