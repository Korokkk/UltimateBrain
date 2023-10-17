import React from 'react';
import {
  useNavigate,
} from 'react-router-dom';
// mui
import {
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
// my components
import Nav from './Nav';

function Home () {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/signin');
    }
  }, []);

  const [sessionId, setSessionId] = React.useState('');
  return (
    <Box>
      <Nav pageTitle='Home' />
        <Box sx={{ display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', marginBottom: '20px' }}>
            <Typography variant='h5' gutterBottom>Manage your quizzes👉</Typography>
            <Button variant='contained' onClick={() => { navigate('/dashboard') }}>Dashboard</Button>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant='h5' gutterBottom>Join a quiz by session id👉</Typography>
            <Input id='session-id-input' onChange={(e) => setSessionId(e.target.value)} />
            <Button variant='contained' onClick={() => { navigate(`/playquiz/${sessionId}`) }}>Go</Button>
          </Box>
        </Box>
    </Box>
  )
}

export default Home;
