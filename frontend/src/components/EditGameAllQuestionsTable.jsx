import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function EditGameAllQuestionsTable ({ allQuestions, quizId, deleteQuestion }) {
  const navigate = useNavigate();
  return (
    <Grid container>
    <Typography variant='h4' gutterBottom>All questions in this quiz</Typography>
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Question Name</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allQuestions.map((question) => (
            <TableRow key={'q' + question.questionId}>
              <TableCell>{question.title}</TableCell>
              <TableCell>
                <Button variant='outlined' onClick={() => { navigate(`/editgame/${quizId}/${question.questionId}`) }}>
                  Edit Button</Button></TableCell>
              <TableCell><Button variant='outlined' color='error' onClick={() => { deleteQuestion(question.questionId) }}>
                Delete Button</Button></TableCell>
            </TableRow>)
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
  )
}

export default EditGameAllQuestionsTable;
