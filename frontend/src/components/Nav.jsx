import React from 'react';
// mui
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// my components
import NavHomeButton from './NavHomeButton';
import NavDashboardButton from './NavDashboardButton';
import NavBackButton from './NavBackButton';
import NavLogOutButton from './NavLogOutButton';
function Nav ({ pageTitle }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <NavHomeButton />
          <NavDashboardButton />
          <NavBackButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <NavLogOutButton />
        </Toolbar>
      </AppBar>
      <br />
    </Box>
  )
}

export default Nav;
