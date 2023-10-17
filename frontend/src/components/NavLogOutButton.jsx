import React from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
function NavLogOutButton () {
  const tokenLocal = localStorage.getItem('token');

  const navigate = useNavigate();
  async function logout () {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenLocal}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.removeItem('token');
      alert('Log Out Successfully. Back to Log In Page.');
      navigate('/signin');
      navigate(0);
    }
  }
  return (
    <Button color='inherit' onClick={logout}>
      <LogoutIcon />
    </Button>
  )
}

export default NavLogOutButton;
