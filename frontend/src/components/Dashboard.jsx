import React from 'react';
// mui components
import {
  Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// my components
import Nav from './Nav';
import DashboardQuizzesTable from './DashboardQuizzesTable';

function Dashboard () {
  const token = localStorage.getItem('token');
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');

  // fetch all quizzes:  /admin/quiz
  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    setQuizzes(data.quizzes);
  }

  React.useEffect(async () => {
    fetchAllQuizzes();
  }, []);

  // Delete quiz
  async function deleteQuiz (quizId) {
    await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    await fetchAllQuizzes();
  }

  // Create quiz
  async function createNewQuiz () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      })
    });
    await fetchAllQuizzes();
  }

  return (
    <>
    <Nav pageTitle='Dashboard' />
    <Box sx={{ margin: 'auto 10px' }}>
      <Typography variant='h4' gutterBottom>🍔Create a new game</Typography>
      <Box sx={{ display: 'flex' }}>
        <TextField placeholder="your quiz name"
              onChange={(e) => setNewQuizName(e.target.value)}
            />
        <Button
          variant="outlined" sx={{ margin: 'auto 10px' }}
          onClick={createNewQuiz}>Create new Game</Button>
      </Box>
      <br /><br/>

      <Typography variant='h4' gutterBottom>🥝Quizzes made by you</Typography>
      <DashboardQuizzesTable quizzes={quizzes} deleteQuiz={deleteQuiz}/>
      <br /><br />
    </Box>
    </>
  )
}

export default Dashboard;
