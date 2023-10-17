import React from 'react';
import { useNavigate } from 'react-router-dom';
// mui
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DashboardQuizzesTable ({ quizzes, deleteQuiz }) {
  const token = localStorage.getItem('token');
  // let pastSessionIdLocal = [];
  let initialPastSessionId = [];
  if (localStorage.getItem('pastSessionId')) {
    initialPastSessionId = JSON.parse(localStorage.getItem('pastSessionId'));
  }
  // let pastQuizNameLocal = [];
  let initialPastQuizName = [];
  if (localStorage.getItem('pastQuizName')) {
    initialPastQuizName = JSON.parse(localStorage.getItem('pastQuizName'));
  }
  let initialSessionIndexArray = [];
  if (localStorage.getItem('pastQuizName')) {
    const tempInitialSessionIndexArray = new Array(initialPastSessionId.length).fill(0);
    for (let i = 0; i < initialPastSessionId.length; i++) {
      tempInitialSessionIndexArray[i] = i;
    }
    initialSessionIndexArray = tempInitialSessionIndexArray;
  }
  const navigate = useNavigate();
  // variables for dashboard (2.2.1)
  const [quizzesDetails, setQuizzesDetails] = React.useState([]);
  // variables for start a game (2.3.1)
  const [startSnackbarOpen, setStartSnackbarOpen] = React.useState(false);
  const [sessionId, setSessionId] = React.useState('');
  // variables for stop a game (2.3.2)
  const [stoppedSession, setStoppedSession] = React.useState('');
  // past stopped session
  const [pastSessionId, setPastSessionId] = React.useState(initialPastSessionId);
  const [pastQuiz, setPastQuiz] = React.useState(initialPastQuizName);
  const [pastSessionIndexArray, setPastSessionIndexArray] = React.useState(initialSessionIndexArray);
  // get question numbers of each quiz
  function getQuestionNumbers (questionObj) {
    if (questionObj === undefined || questionObj === null) {
      return 0;
    } else {
      return Object.keys(questionObj).length;
    }
  }

  // get total time of each quiz
  function calculateTotalTime (allQuestions) {
    let time = 0;
    for (const question of allQuestions) {
      time += Number(question.time);
    }
    return time;
  }

  // fetch each quizzes by Id: /admin/quiz/{quizid}    Thank Micheal!!!
  async function fetchAllQuizzesDetail () {
    const newQuizzesDetails = [];
    await Promise.all(quizzes.map((quiz) => fetch(`http://localhost:5005/admin/quiz/${quiz.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const quizDetails = {};
        quizDetails.id = quiz.id;
        quizDetails.data = data;
        newQuizzesDetails.push(quizDetails);
      })
    ));
    setQuizzesDetails(newQuizzesDetails);
  }

  React.useEffect(async () => {
    fetchAllQuizzesDetail();
  }, [quizzes]); // Thank Adrian!!

  // ----⬇ START a quiz (2.3.1) ⬇----
  const handleStartSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setStartSnackbarOpen(false);
  }
  const startAction = (
    <React.Fragment>
      <Button color='inherit' size='small'
        onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/playquiz/${sessionId}`) }}>Copy</Button>
      <IconButton
        size='small' aria-label='close-start-session-snackbar' color='inherit' onClick={handleStartSnackbarClose}>
          <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  // start session
  async function startSession (quizId) {
    // set Start Snackbar status as open
    setStartSnackbarOpen(true);
    // start session at backend
    await fetch(`http://localhost:5005/admin/quiz/${quizId}/start`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    await showSessionId(quizId);
  }

  async function showSessionId (quizId) {
    // get sessionId
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    setSessionId(data.active);
  }

  // ----⬇ STOP a quiz ⬇ (2.3.2) ----
  async function stopSession (quizId, quizName) {
    await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    setStoppedSession(sessionId); // Thank Aimen!!!
    const tempPastSessionId = pastSessionId;
    tempPastSessionId.push(sessionId);
    setPastSessionId(tempPastSessionId);
    localStorage.setItem('pastSessionId', JSON.stringify(tempPastSessionId));

    const tempPastQuiz = pastQuiz;
    tempPastQuiz.push(quizName);
    setPastQuiz(tempPastQuiz);
    localStorage.setItem('pastQuizName', JSON.stringify(tempPastQuiz));
    const tempPastSessionIndexArray = new Array(tempPastQuiz.length).fill(0);
    for (let i = 0; i < tempPastQuiz.length; i++) {
      tempPastSessionIndexArray[i] = i;
    }
    setPastSessionIndexArray(tempPastSessionIndexArray);
  }

  // ----⬇ ADVANCE a quiz ⬇ ----
  async function advanceSession (quizId) {
    await fetch(`http://localhost:5005/admin/quiz/${quizId}/advance`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
  }

  return (
    <Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start</TableCell>
              <TableCell>Advance</TableCell>
              <TableCell>Stop</TableCell>
              <TableCell>Quiz Name</TableCell>
              <TableCell>Number of Questions</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Total Time</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {JSON.stringify(quizzesDetails)}
            {quizzesDetails.map((quizDetails) => (
              <TableRow key={'quiz-tr' + quizDetails.id}>

                <TableCell key={'quiz-start' + quizDetails.id}>
                  <IconButton onClick={async () => { await startSession(quizDetails.id) }}>
                    <PlayCircleFilledWhiteIcon />
                  </IconButton>
                  <Snackbar open={startSnackbarOpen} autoHideDuration={6000} onClose={handleStartSnackbarClose}
                    message={quizDetails.data.name + ' START💫 session id: ' + sessionId}
                    action={startAction}>
                  </Snackbar>
                </TableCell>

                <TableCell>
                  <IconButton onClick={async () => { await advanceSession(quizDetails.id) }}>
                    <NavigateNextIcon />
                  </IconButton>
                </TableCell>

                <TableCell key={'quiz-stop' + quizDetails.id}>
                  <IconButton onClick={async () => { await stopSession(quizDetails.id, quizDetails.data.name) }}>
                    <StopCircleIcon />
                  </IconButton>
                </TableCell>

                <TableCell key={'quiz-name' + quizDetails.id}>{quizDetails.data.name}</TableCell>
                <TableCell key={'quiz-question-number' + quizDetails.id}>{getQuestionNumbers(quizDetails.data.questions)}</TableCell>
                <TableCell key={'quiz-thumb' + quizDetails.id}>{quizDetails.data.thumbnail === null ? null : <img src={quizDetails.data.thumbnail} alt='thumbnail'/>}</TableCell>
                <TableCell key={'quiz-time' + quizDetails.id}>{calculateTotalTime(quizDetails.data.questions)}</TableCell>
                <TableCell key={'quiz-edit' + quizDetails.id}>
                  <IconButton onClick={() => { navigate('/editgame/' + quizDetails.id) }} style={{ color: '#03a9f4' }} >
                    <EditIcon /></IconButton>
                </TableCell>
                <TableCell key={'quiz-delete' + quizDetails.id}>
                  <IconButton onClick={() => { deleteQuiz(quizDetails.id) }} style={{ color: '#d32f2f' }}>
                    <DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br /><br />
      <Box>
      <Typography variant='h4' gutterBottom>🍰Past Sessions</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Past session id</TableCell>
                <TableCell>quiz name</TableCell>
                <TableCell>link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pastSessionIndexArray.map((i) => (
                <TableRow key={'ps' + i}>
                  <TableCell>{pastSessionId[i]}</TableCell>
                  <TableCell>{pastQuiz[i]}</TableCell>
                  <TableCell><Button onClick={() => { navigate('/adminresult/' + pastSessionId[i]) }}>Link</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={!!stoppedSession} onClose={() => { setStoppedSession(undefined) }}
        aria-labelledby='stop-dialog-title' aria-describedby='stop-dialog-description'>
        <DialogTitle id='stop-dialog-title'>
          Session Stopped
        </DialogTitle>
        <DialogContent id='stop-dialog-description'>
          <DialogContentText>
            Session Stopped. Would you like to view the results?📝
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setStoppedSession(undefined) }}>No</Button>
          <Button onClick={() => {
            setStoppedSession(undefined);
            navigate(`/adminresult/${sessionId}`);
          }} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DashboardQuizzesTable;
