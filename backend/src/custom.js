/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  // console.log('See question: ', question);
  // const tempQuestion = question;
  // console.log('initial tempQ', tempQuestion);
  // delete tempQuestion.answers;
  // console.log('deleted Q:', tempQuestion);
  // return tempQuestion;
  return question;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  console.log('see answers: ', question);
  return question.answers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  // console.log('see choices: ', question.choices);
  return question.choices;
  // return [
  //   123,
  //   456,
  //   678,
  // ]; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  console.log(question)
  console.log('time!', question.time);
  return parseInt(question.time);
};
