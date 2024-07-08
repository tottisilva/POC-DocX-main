'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box, Radio, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import LoadingComponent from '../../layout/loading/Loading';
import StatusDialog from './QuizResult';

interface QuizPageProps {
  trainingStepId: number;
}

interface Answer {
  text: string;
  isCorrect: boolean;
  id: number;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  questions: Question[];
  minScore: number;
}

interface UserTrainingStep {
  id: number;
  trainingStepId: number;
  userId: number;
  stepStatus: 'Completed' | 'Pending' | 'Failed';
  attemptsLeft: number | null;
}

interface QuizCompleteProps {
  trainingId: number;
  trainingStepId: number;
}

const QuizComplete = ({ trainingStepId, trainingId }: QuizCompleteProps) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});
  const [userId, setUserId] = useState<number | null>(null);
  const [userTrainingStepStatus, setUserTrainingStepStatus] = useState<'Completed' | 'Pending' | 'Failed' | ''>('');
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogStatus, setDialogStatus] = useState<'Completed' | 'Failed'>('Failed');
  const [dialogMessage, setDialogMessage] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(parseInt(session.user.id, 10));
    }
  }, [session]);

  useEffect(() => {
    const fetchUserTrainingStepStatus = async () => {
      if (!userId || !trainingStepId) return;

      try {
        const response = await fetch('/api/userTrainingSteps/getUserTrainingStepStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingStepId, userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch UserTrainingStep status');
        }

        const data: UserTrainingStep = await response.json();
        setUserTrainingStepStatus(data.stepStatus);
        setAttemptsLeft(data.attemptsLeft);
      } catch (error) {
        setError(`Error fetching UserTrainingStep status: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrainingStepStatus();
  }, [trainingStepId, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizResponse = await fetch(`/api/quiz/getQuizByTrainingId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingStepId }),
        });

        if (!quizResponse.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const quizData: Quiz = await quizResponse.json();
        setQuiz(quizData);

        const initialSelectedAnswers = Object.fromEntries(quizData.questions.map((_, index) => [index, null]));
        setSelectedAnswers(initialSelectedAnswers);

        const userQuizResponse = await fetch(`/api/userQuizAnswer/getUserQuizAnswers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            quizId: quizData.id,
          }),
        });

        if (!userQuizResponse.ok) {
          throw new Error('Failed to fetch user quiz answers');
        }

        const userQuizData = await userQuizResponse.json();

        const userAnswers = userQuizData.userQuizAnswers.reduce((acc: { [key: number]: number }, answer: { questionId: number, answerId: number }) => {
          const questionIndex = quizData.questions.findIndex(q => q.id === answer.questionId);
          if (questionIndex !== -1) {
            acc[questionIndex] = answer.answerId;
          }
          return acc;
        }, {});

        setSelectedAnswers(userAnswers);
      } catch (error) {
        console.error('Error fetching quiz and user quiz answers:', error);
        setError('Failed to fetch quiz and user quiz answers');
      }
    };

    if (trainingStepId && userId) {
      fetchData();
    }
  }, [trainingStepId, userId]);

  const handleAnswerChange = (questionIndex: number, answerId: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerId });
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions || !userId) return;

    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.questions.reduce((totalCorrect, question, questionIndex) => {
      const answerId = selectedAnswers[questionIndex];
      const selectedAnswer = question.answers.find(answer => answer.id === answerId);
      if (selectedAnswer && selectedAnswer.isCorrect) {
        return totalCorrect + 1;
      }
      return totalCorrect;
    }, 0);

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const passed = scorePercentage >= quiz.minScore;

    try {
      const trainingStepResponse = await fetch('/api/userTrainingSteps/updateUserTrainingStepStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          trainingStepId,
          status: passed ? 'Completed' : 'Failed',
        }),
      });

      if (!trainingStepResponse.ok) {
        throw new Error('Failed to update UserTrainingStep');
      }

      const answers = Object.entries(selectedAnswers).map(([questionIndex, answerId]) => {
        const questionId = quiz.questions[parseInt(questionIndex)].id;
        return {
          questionId,
          answerId,
        };
      });

      const quizAnswerResponse = await fetch('/api/userQuizAnswer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          answers,
          quizId: quiz.id,
          score: scorePercentage,
        }),
      });

      if (!quizAnswerResponse.ok) {
        throw new Error('Failed to create UserQuizAnswers');
      }

      if (!passed) {
        const failedQuizResponse = await fetch('/api/userTrainingSteps/attemptFailed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            trainingStepId,
            trainingId
          }),
        });

        if (!failedQuizResponse.ok) {
          throw new Error('Failed to handle failed quiz action');
        }

        const data = await failedQuizResponse.json();
        setAttemptsLeft(data.attemptsLeft)
      }

      setDialogStatus(passed ? 'Completed' : 'Failed');
      setDialogMessage(passed ? 'Congratulations, you passed!' : 'Sorry, you failed. Please try again.');
      setDialogOpen(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    }
  };

  const onCloseDialog = () => {
    setDialogOpen(false);
    setUserTrainingStepStatus(dialogStatus ? 'Completed' : 'Failed');
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  if (!quiz) {
    return <Typography>Error loading quiz</Typography>;
  }

  const isDisabled = attemptsLeft === 0 || userTrainingStepStatus === 'Completed';

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container>
        <Grid>
          <Typography component="h1" variant="h5" mb={1}>
            Complete Quiz
          </Typography>
        </Grid>
      </Grid>

      <ol>
        {quiz.questions.map((question, index) => (
          <li key={index} style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            <Typography fontWeight="bold">{question.text}</Typography>
            <Box display="flex" flexWrap="wrap" mt={1}>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} style={{ marginRight: '10px', fontWeight: 'normal' }}>
                  <Radio
                    id={`answer-${index}-${answerIndex}`}
                    name={`answer-${index}`}
                    value={answer.id}
                    onChange={() => handleAnswerChange(index, answer.id)}
                    checked={selectedAnswers[index] === answer.id}
                    disabled={isDisabled}
                  />
                  <label htmlFor={`answer-${index}-${answerIndex}`}>{answer.text}</label>
                </div>
              ))}
            </Box>
          </li>
        ))}
      </ol>
      <Grid display='flex' justifyContent='center'>
        <Button variant='contained' disabled={isDisabled} onClick={handleSubmit}>{isDisabled ? 'Completed' : 'Submit'}</Button>
      </Grid>
      

      <StatusDialog
        open={dialogOpen}
        status={dialogStatus}
        message={dialogMessage}
        onClose={onCloseDialog}
        attemptsLeft={attemptsLeft}
      />
    </Box>
  );
};

export default QuizComplete;
