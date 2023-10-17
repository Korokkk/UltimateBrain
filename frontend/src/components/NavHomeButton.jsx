import React from 'react';
import { useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

function NavHomeButton () {
  const navigate = useNavigate();
  return (
    <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { navigate('/') }}
          >
            <HomeIcon />
          </IconButton>
  )
}

export default NavHomeButton;
