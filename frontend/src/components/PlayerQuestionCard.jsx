import React from 'react';
import ReactPlayer from 'react-player';
// mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
function PlayerQuestionCard ({ question, playerId }) {
  // const time = question.time;
  const [checkedState, setCheckedState] = React.useState(new Array(question.choices.length).fill(false)); // checkboxes

  // change check state for choices
  // Reference: https://www.freecodecamp.org/news/how-to-work-with-multiple-checkboxes-in-react/
  function handleCheckboxChange (position) {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  }

  async function submit () {
    // get player's answer from checkboxes
    const playAnswers = []; // player's answer
    for (let i = 0; i < checkedState.length; i++) {
      if (checkedState[i] === true) {
        playAnswers.push(question.choices[i])
      }
    }
    // put player's answer
    await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds: playAnswers
      })
    });
  }

  return (
    <Box sx={{ width: '80%', border: '2px dotted #bbdefb', margin: 'auto' }}>
      <Box sx={{ margin: '10px' }}>
        <Typography variant='h6'>
          {question.title}
        </Typography>
        <Typography variant='h6'>

        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1'>
            {question.type}-choice, worth&nbsp;{question.marks} marks
          </Typography>
          <Typography vairant="subtitle1">
            total {question.time} seconds
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {question.image === ''
          ? null
          : <Box>
              <Typography variant='subtitle1' sx={{ display: 'block' }}>
                Image
              </Typography>
              <img src={question.image}
              style={{ width: '300px', objectFit: 'contain' }}
              alt='question-img' />
            </Box>
        }
        {question.video === ''
          ? null
          : <Box>
              <Typography variant='subtitle1' sx={{ display: 'block' }}>
                Video
              </Typography>
              <ReactPlayer url={question.video} />
            </Box>
        }
      </Box>
      <Grid container columns={{ xs: 4, md: 12 }}>
        {question.choices.map((c, index) => (
          <Grid item xs={4} md={6} key={'choice-box' + index}>
            <Box sx={{ display: 'flex' }}>
            <Typography>
              {c}
            </Typography>
            <Checkbox onChange={() => { handleCheckboxChange(index) }} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ width: '100%', display: 'flex', marginTop: '20px' }}>
        <Button sx={{ marginX: 'auto' }}
          onClick={async () => { await submit() }}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}

export default PlayerQuestionCard;
