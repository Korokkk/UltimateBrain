import React from 'react';
// mui
import {
  Box, Typography,
  // Button,
} from '@mui/material';
function PlayerAnswerCard ({ answer }) {
  return (
    <Box sx={{ padding: '5%' }}>
      <Typography variant='h6' gutterBottom>
        Time is up! Correct Answer is ...
      </Typography>
      {
        answer.map((a, i) => (
          <Typography key={'player-result-answer' + i} variant='subtitle1'>{a}</Typography>
        ))
      }
    </Box>
  )
}

export default PlayerAnswerCard;
