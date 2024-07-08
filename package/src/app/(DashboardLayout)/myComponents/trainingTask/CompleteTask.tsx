'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Box, Typography, Grid, Button, Card } from '@mui/material';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import QuizComplete from '@/app/(DashboardLayout)/myComponents/quiz/QuizComplete';
import DocumentsTable from '@/app/(DashboardLayout)/myComponents/documents/GetDocumentByTrainingId';
import { useSession } from 'next-auth/react';
import VideoPreview from '@/app/(DashboardLayout)/myComponents/trainings/VideoPlayer';
import CompleteStepButton from '@/app/(DashboardLayout)/myComponents/trainingSteps/CompleteTrainingStepButton';
import LoadingComponent from '@/app/(DashboardLayout)/layout/loading/Loading';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSearchParams } from 'next/navigation';
 
interface Training {
  id: number;
  title: string;
  typeId: number;
  url: string;
}
 
interface TrainingType {
  id: number;
  title: string;
}
 
interface TrainingStep {
  id: number;
  description: string;
  url: string;
  trainingType: TrainingType;
  stepNumber: number;
  trainingId: number;
}
 
interface UserTrainingStep {
  id: number;
  trainingId: number;
  userId: number;
  trainingStep: TrainingStep;
  stepStatus: 'Completed' | 'Pending' | 'Failed';
}
 
type UserTraining = {
  userId: number;
  trainingId: number;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: Date;
  createdBy: number;
  user: {
    name: string;
  };
  training: {
    description: string;
  };
};
 
interface CustomTabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}
 
const CustomTabPanel: React.FC<CustomTabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`step-${index}`}
  >
    {value === index && (
      <Box>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);
 
const CompleteTrainingTask: React.FC = () => {
  const [value, setValue] = useState(0);
  const [training, setTraining] = useState<Training | null>(null);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [userTrainingSteps, setUserTrainingSteps] = useState<UserTrainingStep[]>([]);
  const [userTrainingStatus, setUserTrainingStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const trainingId = searchParams.get('id') || '0';
 
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(parseInt(session.user.id,10));
    }
  }, [session]);
 
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await fetch(`/api/trainings/${trainingId}`);
        if (response.ok) {
          const data: Training = await response.json();
          setTraining(data);
        } else {
          setError('Failed to fetch training details');
        }
      } catch (error) {
        setError(`Fetch training error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
 
    if (trainingId) {
      fetchTraining();
    }
  }, [trainingId]);
 
  useEffect(() => {
    const fetchTrainingSteps = async () => {
      try {
        const response = await fetch(`/api/userTrainingSteps/getUserTrainingSteps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingId: parseInt(trainingId, 10), userId }),
        });
 
        if (response.ok) {
          const data: UserTrainingStep[] = await response.json();
          setUserTrainingSteps(data);
          const trainingStepsData: TrainingStep[] = data.map((userTrainingStep) => userTrainingStep.trainingStep);
          setTrainingSteps(trainingStepsData);
        } else {
          setError('Failed to fetch training steps');
        }
      } catch (error) {
        setError(`Error fetching training steps: ${error}`);
      } finally {
        setLoading(false);
      }
    };
 
    if (trainingId && userId) {
      fetchTrainingSteps();
    }
  }, [trainingId, userId]);
 
  useEffect(() => {
    const fetchUserTrainingStatus = async () => {
      try {
        const response = await fetch('/api/userTraining/getUserTrainingStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingId: parseInt(trainingId, 10), userId }),
        });

        if (response.ok) {
          const data: UserTraining = await response.json();
          setUserTrainingStatus(data.status);
        } else {
          setError('Failed to fetch UserTraining status');
        }
      } catch (error) {
        setError(`Error fetching UserTraining status: ${error}`);
      } finally {
        setLoading(false); // Make sure to handle loading state properly
      }
    };

    if (trainingId && userId) {
      fetchUserTrainingStatus();
    }
  }, [trainingId, userId, userTrainingSteps]);
 
  const handleNext = () => {
    setValue((prevValue) => prevValue + 1);
  };
 
  const handleBack = () => {
    setValue((prevValue) => prevValue - 1);
  };
 
  if (loading) {
    return <div><LoadingComponent/></div>;
  }
 
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  if (!trainingId || !training) {
    return <div>No training data found.</div>;
  }
 
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box pb={3}>
          <Stepper activeStep={value} alternativeLabel sx={{ minWidth: '100%', }}>
            {trainingSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{`Step ${step.stepNumber}`}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
     
        {trainingSteps.map((step, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {step.trainingType.title === 'R&U' && (
              <DocumentsTable trainingStepId={step.id} />
            )}
            {step.trainingType.title === 'Quiz' && (
              <QuizComplete trainingStepId={step.id} trainingId={parseInt(trainingId,10)} />
            )}
            {step.trainingType.title === 'Video' && (
              <VideoPreview videoUrl={step.url} />
            )}
            {step.trainingType.title !== 'Quiz' && (
              <Grid display="flex" justifyContent="center" mt={2}>
                <CompleteStepButton userId={userId.toString()} trainingStepId={step.id} trainingId={step.trainingId} />
              </Grid>
             
            )}
          </CustomTabPanel>
        ))}
        <Box mt={2} display="flex" justifyContent="space-between">
        <Button disabled={value === 0} onClick={handleBack}>
          <ArrowBackIosNewIcon fontSize='small' /> Back
        </Button>
        {value < trainingSteps.length - 1 && (
          <Button
            onClick={handleNext}
          >
            Next <ArrowForwardIosIcon fontSize='small'/>
          </Button>
        )}
      </Box>
      </Card>
    </>
  );
};

export default CompleteTrainingTask;