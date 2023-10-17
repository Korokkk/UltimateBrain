import React from 'react';
import {
  useParams,
  useNavigate,
} from 'react-router-dom';

// mui
import {
  Box,
  Button,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
// my components
import Nav from './Nav';

// for 2.4.1 Play Join
function PlayerJoinPage () {
  const sessionId = useParams().sessionid;
  const [name, setName] = React.useState(''); // player name
  const [playerId, setPlayerId] = React.useState('');
  const navigate = useNavigate();
  async function joinSession () {
    const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
      })
    });
    const data = await response.json();
    setPlayerId(data.playerId);
    navigate(`/playquiz/${sessionId}/${data.playerId}`);
  }

  return (
    <Box>
      <Nav pageTitle={'Session: ' + sessionId} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'block', marginBottom: '10px' }}>
          <InputLabel htmlFor='player-name-input'>Your Name</InputLabel>
          <Input id='player-name-input' onChange={(e) => setName(e.target.value)} />
          <Button onClick={async () => { joinSession(sessionId) }}>Join this Session!</Button>
        </Box>
        <Box sx={{ display: 'block' }}>
          {playerId}
        </Box>
      </Box>
    </Box>
  )
}

export default PlayerJoinPage;
