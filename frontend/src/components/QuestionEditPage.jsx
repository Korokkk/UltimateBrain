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
// my components
import Nav from './Nav';

function QuestionEditPage () {
  const token = localStorage.getItem('token');
  const quizId = useParams().quizid;
  const questionId = parseInt(useParams().questionid);

  // Current Quiz
  const [allQuestions, setAllQuestions] = React.useState([]);
  const [Name, setName] = React.useState('');
  const [Thumbnail, setThumbnail] = React.useState('');
  // question we're editing
  const [question, setQuestion] = React.useState([]);

  // for editing question, get content in input
  const choiceIndexes = [1, 2, 3, 4, 5, 6];
  const [type, setType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('');
  const [marks, setMarks] = React.useState('');
  const [image, setImage] = React.useState('');
  const [video, setVideo] = React.useState('');
  // text content in Input and Checkbox
  const [newChoices, setNewChoices] = React.useState(new Array(6).fill(''));
  const [checkedState, setCheckedState] = React.useState(new Array(6).fill(false));

  // get new choices content in Input   Thank Edwina!!!
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

  // upload Image File (from assignment 3: help.js)  Thank Gordon!!!
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

  async function editQuestionToDatabase () {
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
    // object of the edited question
    const editedQuestionObj = {
      questionId,
      type,
      title,
      time: parseInt(time),
      marks,
      image,
      video,
      choices,
      answers
    };
    const editedAllQuestions = [];
    // in all questions, replace the previous question with edited question. Thank Aimen!!!
    for (let i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].questionId === questionId) {
        editedAllQuestions.push(editedQuestionObj);
      } else {
        editedAllQuestions.push(allQuestions[i]);
      }
    }
    await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questions: editedAllQuestions,
        name: Name,
        thumbnail: Thumbnail
      })
    });
  }

  // fetch current quiz
  async function fetchGameQuestions () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    setAllQuestions(data.questions);
    setName(data.name);
    setThumbnail(data.thumbnail);
    setQuestion(data.questions[questionId]);
    setTitle(data.questions[questionId].title);
  }

  React.useEffect(async () => {
    fetchGameQuestions();
  }, []);
  return (
    <Box>
      <Nav pageTitle={'Edit Question: ' + question.title} />
      <Grid container>
        <Grid item md={2}></Grid>
        <Grid item md={8}>
          <Typography variant='h4' gutterBottom>Edit it Here⬇️</Typography>
          <Typography variant='h6' gutterBottom>Question Type</Typography>
          <FormControl>
            <RadioGroup aria-labelledby='question-edit-type-label' name='radio-buttons-group'
              onChange={(e) => setType(e.target.value)}>
              <FormControlLabel value='single' control={<Radio />} label='Single' />
              <FormControlLabel value='multiple' control={<Radio />} label='Multiple' />
            </RadioGroup>
          </FormControl>

          <Typography variant='h6' gutterBottom>Title</Typography>
          <FormControl><Input id='q-title'
            onChange={(e) => setTitle(e.target.value)} /></FormControl>

          <Typography variant='h6' gutterBottom>Time</Typography>
          <FormControl><Input id='q-time'
          onChange={(e) => setTime(parseInt(e.target.value))} /></FormControl>

          <Typography variant='h6' gutterBottom>Marks</Typography>
          <FormControl><Input id='q-marks'
          onChange={(e) => setMarks(e.target.value)} /></FormControl>

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
            <Button onClick={async () => await editQuestionToDatabase()} variant="contained" sx={{ marginX: 'auto' }}>Submit</Button>
          </Box>
        </Grid>
      <Grid item md={2}></Grid>
      </Grid>
    </Box>
  )
}

export default QuestionEditPage;
