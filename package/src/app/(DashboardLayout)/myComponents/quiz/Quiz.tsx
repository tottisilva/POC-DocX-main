import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, Box, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
}

interface Props {
  trainingStepId: number | null;
}

export default function CreateQuiz({ trainingStepId }: Props) {
  const [minScore, setMinScore] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([{ text: '', answers: [{ text: '', isCorrect: false }] }]);
  const [isQuizFetched, setIsQuizFetched] = useState<boolean>(false);

  useEffect(() => {
    if (trainingStepId !== null) {
      fetchQuizData(trainingStepId);
    }
  }, [trainingStepId]);

  const fetchQuizData = async (trainingStepId: number) => {
    try {
      const response = await fetch(`/api/quiz/get-quiz-by-trainingStepId?trainingStepId=${trainingStepId}`);
      if (response.ok) {
        const quizData = await response.json();
        setMinScore(quizData.minScore);
        setQuestions(quizData.questions.map((q: any) => ({
          text: q.text,
          answers: q.answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        })));
        setIsQuizFetched(true);
      } else if (response.status === 404) {
        setIsQuizFetched(false);
        console.log('Quiz not found');
      } else {
        console.error('Failed to fetch quiz data');
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', answers: [{ text: '', isCorrect: false }] }]);
  };

  const handleQuestionChange = (index: number, newText: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = newText;
    setQuestions(newQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].answers.length < 5) {
      newQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
      setQuestions(newQuestions);
    } else {
      console.log('Maximum number of answers reached');
      // Optionally, display a message to the user indicating the limit has been reached
    }
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, newText: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].text = newText;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.forEach((answer, index) => {
      answer.isCorrect = index === answerIndex;
    });
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      const method = isQuizFetched ? 'PUT' : 'POST';
      const response = await fetch('/api/quiz/createQuiz', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Your Quiz Title', // Add your quiz title here
          minScore,
          trainingStepId,
          questions,
        }),
      });
      if (response.ok) {
        console.log('Quiz saved successfully');
        // Redirect or display a success message
      } else {
        console.error('Failed to save quiz');
        // Display an error message
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      // Handle errors here
    }
  };

  return (
    <div>
      <Box mb={2}>
        <TextField
          label="Minimum Score"
          type="number"
          value={minScore}
          onChange={(e) => setMinScore(parseInt(e.target.value))}
        />
      </Box>
      
      {questions.map((question, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Question {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Question"
              fullWidth
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            />
            <Grid container gap={2}>
              {question.answers.map((answer, answerIndex) => (
                <Grid xs={12} md={2} mt={2} key={answerIndex}>
                  <TextField
                    label={`Answer ${answerIndex + 1}`}
                    fullWidth
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
                  />
                  <Button onClick={() => handleCorrectAnswerChange(index, answerIndex)}>
                    {answer.isCorrect ? 'Correct Answer' : 'Mark as Correct'}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Grid display="flex" justifyContent="flex-end">
              <Button variant='contained' onClick={() => addAnswer(index)}>Add Answer</Button>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Grid container display="flex" justifyContent="flex-end" mt={2} gap={2}>
        <Button onClick={addQuestion}>Add Question</Button>
        <Button onClick={handleSubmit} variant='contained'>Submit</Button>
      </Grid>
      
    </div>
  );
}
