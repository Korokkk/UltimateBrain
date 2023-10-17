import React from 'react';
import { useParams } from 'react-router-dom';
// mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Button, FormControlLabel, Grid } from '@mui/material';
// my component
import EditGameAllQuestionsTable from './EditGameAllQuestionsTable';
import Nav from './Nav';

function EditGamePage () {
  const quizId = useParams().quizid;
  const token = localStorage.getItem('token');
  // exist questions
  const [allQuestions, setAllQuestions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');

  // create new question
  const choiceIndexes = [1, 2, 3, 4, 5, 6];
  const [type, setType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('');
  const [marks, setMarks] = React.useState('');
  const [image, setImage] = React.useState('');
  const [video, setVideo] = React.useState('');
  const [newChoices, setNewChoices] = React.useState(new Array(6).fill('')); // 6 choices text inputs
  const [checkedState, setCheckedState] = React.useState(new Array(6).fill(false)); // 6 checkboxes

  // delete a question by click DELETE BUTTON
  async function deleteQuestion (questionId) {
    // make question list without deleting question
    const newQuestions = [];
    for (const question of allQuestions) {
      if (question.questionId !== questionId) {
        newQuestions.push(question);
      }
    }
    setAllQuestions(newQuestions);
    await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questions: newQuestions,
        name: quizName,
        thumbnail: quizThumbnail
      })
    });
    await fetchAllQuestions();
  }

  async function fetchAllQuestions () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    const tempQuestions = [];
    for (const question of data.questions) {
      tempQuestions.push(question);
    }
    setAllQuestions(tempQuestions);
    setQuizName(data.name);
    setQuizThumbnail(data.thumbnail);
  }

  // -----------------⬇ Create new questions Functions ⬇----------------------
  // upload Image File (from assignment 3: help.js) Thank Gordon!!!
  function fileToDataUrl (file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  }

  function handleChoiceTextChange (e, index) {
    const updatedChoices = newChoices.map((item, i) =>
      i === index ? e.target.value : item
    );
    setNewChoices(updatedChoices);
  }

  // change check state for choices
  // Reference: https://www.freecodecamp.org/news/how-to-work-with-multiple-checkboxes-in-react/
  const handleCheckboxChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // put question created to db  Thank Haoyu
  async function putQuestionToDatabase () {
    // collect user's choices&answers
    const choices = [];
    const answers = [];
    for (let index = 0; index < 6; ++index) {
      if (newChoices[index] !== '') {
        choices.push(newChoices[index]);
        if (checkedState[index] === true) {
          answers.push(newChoices[index]);
        }
      }
    }
    // check user's inputs are valid
    if (type === '') {
      alert('please select question type.');
      return;
    }
    if (title === '') {
      alert('please input question title.');
      return;
    }
    if (time === '') {
      alert('please set time limit of this question.');
      return;
    }
    if (marks === '') {
      alert('please set score of this question.');
      return;
    }
    if (choices.length === 0) {
      alert('please input choices');
      return;
    }
    if (answers.length === 0) {
      alert('please select answers');
      return;
    }
    if (type === 'single' && answers.length > 1) {
      alert('single-choice question should only have one answer!');
      return;
    }
    if (type === 'double' && answers.length < 2) {
      alert('double-choice question should have at least two answer!');
      return;
    }

    // put new question to database
    if (choices.length > 0 && answers.length > 0) {
      const questionId = allQuestions.length;
      const newQuestionObj = {
        questionId,
        type,
        title,
        time,
        marks,
        image,
        video,
        choices,
        answers
      };
      const allQuestionsObj = allQuestions;
      allQuestionsObj.push(newQuestionObj);
      await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questions: allQuestionsObj,
          name: quizName,
          thumbnail: quizThumbnail
        })
      });
      await fetchAllQuestions();
    }
  }
  // -----------------⬆ Create new questions Functions ⬆----------------------

  React.useEffect(async () => {
    fetchAllQuestions();
  }, []);

  return (
    <Box>
      <Nav pageTitle={'Edit Game: ' + quizName}/>
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item md={8}>
            <EditGameAllQuestionsTable allQuestions={allQuestions} quizId={quizId} deleteQuestion={deleteQuestion} />
            <br /><br />
            <Typography variant='h4' gutterBottom>Create a new question</Typography>
            <Typography variant='h6' gutterBottom>Question Type</Typography>
            <FormControl>
              <RadioGroup aria-labelledby='question-edit-type-label' name='radio-buttons-group' row={true}
                onChange={(e) => setType(e.target.value)}>
                <FormControlLabel value='single' control={<Radio />} label='Single' />
                <FormControlLabel value='multiple' control={<Radio />} label='Multiple' />
              </RadioGroup>
            </FormControl>

            <Typography variant='h6' gutterBottom>Title</Typography>
            <FormControl><Input id='q-title' onChange={(e) => setTitle(e.target.value)} /></FormControl>

            <Typography variant='h6' gutterBottom>Time</Typography>
            <FormControl><Input id='q-title' onChange={(e) => setTime(e.target.value)} /></FormControl>

            <Typography variant='h6' gutterBottom>Marks</Typography>
            <FormControl><Input id='q-title' onChange={(e) => setMarks(e.target.value)} /></FormControl>

            <Typography variant='h6' gutterBottom>Image</Typography>
            <FormControl>
              <Button variant='outlined' component='label'>
                Upload<input hidden accept='image/*' type='file' onChange={(e) => {
                fileToDataUrl(e.target.files[0]).then((newImg) => setImage(newImg))
              }} />
              </Button>
            </FormControl>

            <Typography variant='h6' gutterBottom>Video</Typography>
            <FormControl><Input id='q-title' onChange={(e) => setVideo(e.target.value)} /></FormControl>

            <Typography variant='h6' gutterBottom>Choices (at least two choices)</Typography>
            <Grid container columns={1}>{
            choiceIndexes.map((i, index) => (
              <Grid key={index} item>
                <FormControl key={'choice-form' + index} variant='standard'>
                  <Box sx={{ display: 'flex' }}>
                      <InputLabel htmlFor={'c' + index}>{'Choice ' + i}</InputLabel>
                      <Input id={'c' + index} onChange={(e) => handleChoiceTextChange(e, index)} />
                      <Checkbox onChange={() => { handleCheckboxChange(index) }}/>
                  </Box>
                </FormControl>
              </Grid>
            ))}
            </Grid>

            <Box sx={{ width: '100%', display: 'flex', marginTop: '30px' }}>
              <Button onClick={async () => await putQuestionToDatabase()} variant="contained" sx={{ marginX: 'auto' }}>Submit</Button>
            </Box>
          </Grid>
          <Grid item md={2}></Grid>
      </Grid>
    </Box>
  )
}

export default EditGamePage;
