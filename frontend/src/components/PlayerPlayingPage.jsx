import React from 'react';
import { useParams } from 'react-router-dom';
import Countdown from 'react-countdown';
// mui
import {
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
// my components
import Nav from './Nav';
import PlayerQuestionCard from './PlayerQuestionCard';
import PlayerAnswerCard from './PlayerAnswerCard';
import PlayerResultCard from './PlayerResultCard';

function PlayerPlayingPage () {
  const playerId = useParams().playerid;
  const [page, setPage] = React.useState('waiting'); // waiting, question, answer, result
  const [question, setQuestion] = React.useState({});
  const [answer, setAnswer] = React.useState([]);
  const [result, setResult] = React.useState({});
  async function fetchPlayerAnswer (playerId) {
    // fetch player's correct answers
    const resAnswers = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    if (resAnswers.ok) {
      const dataAnswer = await resAnswers.json();
      setAnswer(dataAnswer.answerIds);
      setPage('answer');
    }
  }

  async function fetchPlayerEverything (playerId, tempQuestion) {
    // fetch player's session status
    const resStatus = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    if (resStatus.ok) { // session is active
      // fetch player's current question
      const resQuestion = await fetch(`http://localhost:5005/play/${playerId}/question`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      if (resQuestion.ok) { // player answering time
        const dataQuestion = await resQuestion.json();
        // get new question
        if (dataQuestion.question.questionId !== tempQuestion.question?.questionId) {
          tempQuestion.question = dataQuestion.question;
          setQuestion(tempQuestion.question);
          setPage('question');
        }
      }
    } else { // admin stopped session
      // fetch session's player result
      const resResult = await fetch(`http://localhost:5005/play/${playerId}/results`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      if (resResult.ok) {
        const dataResult = await resResult.json();
        setResult(dataResult);
        setPage('result');
      }
    }
  }

  React.useEffect(() => {
    const tempQuestion = {};
    const tempAnswer = {};
    window.setInterval(async () => {
      await fetchPlayerEverything(playerId, tempQuestion, tempAnswer); // fetchhh
    }, 1000)
  }, []);

  return (
    <Box>
      <Nav pageTitle='player' />
      {page === 'waiting'
        ? <Box>
            <Typography variant='h6' gutterBottom>
              Session started. waiting for first advance.
            </Typography>
          </Box>
        : null
      }
      {page === 'question'
        ? <Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Countdown date={Date.now() + question.time * 1000} onComplete={() => { fetchPlayerAnswer(playerId) }} />
            </Box>
            <PlayerQuestionCard question={question} playerId={playerId}/>
          </Box>
        : null
      }
      {page === 'answer'
        ? <Box>
            <Typography></Typography>
            <Box sx={{ width: '80%', border: '2px dotted #bbdefb', margin: 'auto' }}>
              <Box sx={{ margin: '10px' }}>
                <Typography variant='h6'>
                  {question.title}
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
              <PlayerAnswerCard answer={answer} />
            </Box>
          </Box>
        : null
      }
      {page === 'result'
        ? <Box>
            <Box sx={{ width: '80%', border: '2px dotted #bbdefb', margin: 'auto' }}>
              <Typography variant='h5' gutterBottom>Session stopped by admin.</Typography>
              <Typography variant='subtitle1'>This is your result of this session</Typography>
              <PlayerResultCard result={result} />
            </Box>
          </Box>
        : null
      }
    </Box>
  )
}

export default PlayerPlayingPage;
