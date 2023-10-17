import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function NavBackButton () {
  const navigate = useNavigate();
  return (
    <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={() => { navigate(-1) }}
          >
            <ArrowBackIcon />
          </IconButton>
  )
}

export default NavBackButton;
