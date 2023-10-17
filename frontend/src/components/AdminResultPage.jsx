import React from 'react';
import { useParams } from 'react-router-dom';
// mui
import { Box, Typography } from '@mui/material';
// mui table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// my components
import Nav from './Nav';
// Chart JS2
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// for 2.3.3 Getting the results of a game (from admin)
function AdminResultPage () {
  const token = localStorage.getItem('token');
  const sessionId = useParams().sessionid;
  // ⬇ mark for each question
  const [markList, setMarkList] = React.useState([]);
  // ⬇ player's performance. For example: {'Harry': [false, true, true], 'Hermione': [true, true, true], 'Ron': [true, false, false]}
  const [playerCorrects, setPlayerCorrects] = React.useState({});
  // ⬇ player's score. For example: {'Harry': 70, 'Hermione': 100, 'Ron': 85}
  const [playerScore, setPlayerScore] = React.useState({});
  // ⬇ top 5 players' name
  const [topPlayer, setTopPlayer] = React.useState([]);
  // ⬇ correctPercentage of each question
  const [barChartLabels, setBarChartLabels] = React.useState([]);
  const [correctPercentage, setCorrectPercentage] = React.useState([]);
  // ⬇ average answering time of each question
  const [averageTime, setAverageTime] = React.useState([]);
  // ⬇ average score of this session
  const [averageScore, setAverageScore] = React.useState(0);
  async function calculateEverything (sessionId) {
    // fetch Session Status
    const responseStatus = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const dataStatus = await responseStatus.json();
    console.log('admin status', dataStatus);

    // fetch Session Results
    const responseResults = await fetch(`http://localhost:5005/admin/session/${sessionId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const dataResults = await responseResults.json();
    console.log('admin results', dataResults);

    // get marks of each question
    const tempMarkList = [];
    for (const q of dataStatus.results.questions) {
      tempMarkList.push(q.marks);
    }
    console.log('tempMarkList', tempMarkList);
    setMarkList(tempMarkList);

    // get players' performance
    const tempPlayerCorrects = {};
    let tempName = '';
    let tempIsCorrect = [];
    for (const playerResult of dataResults.results) {
      tempName = playerResult.name;
      tempIsCorrect = [];
      for (const answer of playerResult.answers) {
        tempIsCorrect.push(answer.correct);
      }
      tempPlayerCorrects[tempName] = tempIsCorrect;
    }
    console.log('tempPlayerCorrects', tempPlayerCorrects);
    setPlayerCorrects(tempPlayerCorrects);

    // calculate score of each player
    const tempPlayerScore = {};
    const questionNumber = dataStatus.results.questions.length;
    if (questionNumber === tempMarkList.length) {
      console.log('question number good');
    } else {
      console.log('question number bad');
    }
    let tempScore = 0;
    for (const player in tempPlayerCorrects) {
      tempScore = 0;
      for (let i = 0; i < questionNumber; ++i) {
        console.log('test test...', player, i, tempPlayerCorrects[player][i]);
        if (tempPlayerCorrects[player][i] === true) {
          tempScore += parseInt(tempMarkList[i]);
        }
      }
      tempPlayerScore[player] = tempScore;
    }
    console.log('tempPlayerScore', tempPlayerScore);
    setPlayerScore(tempPlayerScore);

    // get the top 5 players
    const reversePlayers = Object.keys(tempPlayerScore);
    // https://stackoverflow.com/questions/43773092/how-to-sort-objects-by-value only this line ⬇
    reversePlayers.sort(function (a, b) { return tempPlayerScore[a] - tempPlayerScore[b] }); // sorted by lowest to highest score
    const sortPlayers = reversePlayers.reverse(); // players' name list sorted by highest to lowest score
    const tempTopPlayer = []
    for (let i = 0; i < 5; i++) { // only need top 5
      tempTopPlayer.push(sortPlayers[i]);
    }
    setTopPlayer(tempTopPlayer);
    console.log(tempTopPlayer);

    // calculate correct percentage of each question
    const tempCorrectCount = new Array(questionNumber).fill(0);
    let cc = 0;
    for (let i = 0; i < questionNumber; i++) {
      cc = 0;
      for (const pc in tempPlayerCorrects) {
        if (tempPlayerCorrects[pc][i] === true) {
          cc += 1;
        }
      }
      tempCorrectCount[i] = cc;
    }
    console.log('tempCorrectCount: ', tempCorrectCount);

    const playerNumber = Object.keys(tempPlayerCorrects).length;
    console.log('playerNumber: ', playerNumber);
    const tempCorrectPercentage = new Array(questionNumber).fill(0);
    const tempBarChartLabels = [];
    for (let i = 0; i < questionNumber; i++) {
      tempBarChartLabels.push(`Question ${i + 1}`);
      tempCorrectPercentage[i] = Number.parseFloat(tempCorrectCount[i] / playerNumber).toFixed(3);
    }
    console.log('percentage: ', tempCorrectPercentage);
    setBarChartLabels(tempBarChartLabels);
    setCorrectPercentage(tempCorrectPercentage);

    // about time
    const startAt = dataResults.results[0].answers[0].questionStartedAt;
    const answerAt = dataResults.results[0].answers[0].answeredAt;
    console.log('startAt: ', startAt, ', answerAt', answerAt);
    const startAtTime = new Date(startAt);
    const answerAtTime = new Date(answerAt);
    const second = (answerAtTime - startAtTime) / 1000;
    console.log(second);
    const tempTotalTimeOfEachQuestion = new Array(questionNumber).fill(0);
    for (let i = 0; i < playerNumber; i++) {
      for (let j = 0; j < questionNumber; j++) {
        const answerTime = new Date(dataResults.results[i].answers[j].answeredAt);
        const startTime = new Date(dataResults.results[i].answers[j].questionStartedAt);
        const s = (answerTime - startTime) / 1000 // player i, answer question j, using s seconds
        tempTotalTimeOfEachQuestion[j] += s;
      }
    }
    console.log(tempTotalTimeOfEachQuestion);
    const tempAverageTimeOfEachQuestion = [];
    for (const tt of tempTotalTimeOfEachQuestion) {
      tempAverageTimeOfEachQuestion.push(Number.parseFloat(tt / playerNumber).toFixed(3));
    }
    console.log('tempAverageTimeOfEachQuestion', tempAverageTimeOfEachQuestion);
    setAverageTime(tempAverageTimeOfEachQuestion);

    // interesting average score
    let totalScore = 0;
    for (const s in tempPlayerScore) {
      totalScore += tempPlayerScore[s];
    }
    const tempAverageScore = Number.parseFloat(totalScore / playerNumber).toFixed(2);
    setAverageScore(tempAverageScore);
  }

  React.useEffect(async () => {
    await calculateEverything(sessionId);
    console.log('hello effect', markList, playerCorrects, playerScore, topPlayer);
  }, []);
  return (
    <Box>
      <Nav pageTitle={'Admin Session:' + sessionId} />
      <Box sx={{ margin: '10px' }}>
        <Typography variant='h4'>🎉Top Players</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ranking</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                  topPlayer.map((p, i) => (
                    <TableRow key={'top' + i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{p}</TableCell>
                      <TableCell>{playerScore[p]}</TableCell>
                    </TableRow>
                  ))
                }
            </TableBody>
          </Table>
        </TableContainer>
        <br /><br />
        <Typography variant='h4'>📊Correction Rate</Typography>
        <Bar data={{
          labels: barChartLabels,
          datasets: [
            {
              label: barChartLabels,
              data: correctPercentage,
              backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }
          ]
        }}></Bar>
        <br /><br />
        <Typography variant='h4'>🕰️Answer time</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question id</TableCell>
                <TableCell>Average Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                averageTime.map((t, i) => (
                  <TableRow key={'atime' + i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{t}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <br /><br />
        <Typography variant='h4' gutterBottom>💯Average Score</Typography>
        <Box>Average score of this session is {averageScore}.</Box>
      </Box>
    </Box>
  )
}

export default AdminResultPage;
