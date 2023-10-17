import React from 'react';
// mui
import {
  Box,
  // Button,
} from '@mui/material';
// my component

function PlayerResultCard ({ result }) {
  return (
    <Box>
      {
        result.map((r, index) => (
          r.correct
            ? <Box key={'r' + index}>Question {index + 1}: ✅</Box>
            : <Box key={'r' + index}>Question {index + 1}: ❌</Box>
        ))
      }
    </Box>
  )
}

export default PlayerResultCard;
