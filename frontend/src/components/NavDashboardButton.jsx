import React from 'react';
import { useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from '@mui/icons-material/Dashboard';

function NavDashboardButton () {
  const navigate = useNavigate();
  return (
    <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { navigate('/dashboard') }}
          >
            <DashboardIcon />
          </IconButton>
  )
}

export default NavDashboardButton;
