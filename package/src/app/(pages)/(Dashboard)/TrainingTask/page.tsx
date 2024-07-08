'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useSession } from 'next-auth/react';
import LoadingComponent from '@/app/(DashboardLayout)/layout/loading/Loading';
import { useSearchParams } from 'next/navigation';
import CompleteTrainingTask from '@/app/(DashboardLayout)/myComponents/trainingTask/CompleteTask';

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
  status: string;
  createdAt: Date;
  createdBy: number;
  user: {
    name: string;
  };
  training: {
    description: string;
  };
};

interface UserTrainingAuditLog {
  id: number;
  userId: number;
  trainingId: number;
  comment: string;
  newStatus: string;
  creator: {
    name: string;
  };
  createdAt: Date;
}

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

const TrainingTask: React.FC = () => {
  const [value, setValue] = useState(0);
  const [training, setTraining] = useState<Training | null>(null);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [userTrainingSteps, setUserTrainingSteps] = useState<UserTrainingStep[]>([]);
  const [userTrainingStatus, setUserTrainingStatus] = useState<string>('Pending');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<UserTrainingAuditLog[]>([]);
  const [allStepsCompleted, setAllStepsCompleted] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const trainingId = searchParams.get('id') || '0';

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(parseInt(session.user.id, 10));
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
          setUserTrainingStatus(data.status); // Update status correctly
        } else {
          setError('Failed to fetch UserTraining status');
        }
      } catch (error) {
        setError(`Error fetching UserTraining status: ${error}`);
      } finally {
        setLoading(false);
      }
    };    

    if (trainingId && userId) {
      fetchUserTrainingStatus();
    }
  }, [trainingId, userId, status]);

  useEffect(() => {
    const fetchUserTrainingAuditLog = async () => {
      try {
        const response = await fetch('/api/userTraining/getUserTrainingAuditLog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingId: parseInt(trainingId, 10), userId }),
        });
  
        if (response.ok) {
          const data: UserTrainingAuditLog[] = await response.json(); // Expecting an array of audit logs
          setAuditLogs(data);
        } else {
          setError('Failed to fetch UserTraining audit logs');
        }
      } catch (error) {
        setError(`Error fetching UserTraining audit logs: ${error}`);
      } finally {
        setLoading(false); // Make sure to handle loading state properly
      }
    };
  
    if (trainingId && userId) {
      fetchUserTrainingAuditLog();
    }
  }, [trainingId, userId]);
  

  useEffect(() => {
    const checkAllStepsCompleted = async () => {
      try {
        const response = await fetch('/api/userTrainingSteps/validateCompletedSteps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingId: parseInt(trainingId, 10), userId }),
        });

        if (response.ok) {
          const { allCompleted } = await response.json();
          setAllStepsCompleted(allCompleted);
        } else {
          setError('Failed to check if all steps are completed');
        }
      } catch (error) {
        setError(`Error checking all steps completion: ${error}`);
      }
    };

    if (trainingId && userId) {
      checkAllStepsCompleted();
    }
  }, [trainingId, userId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCompleteTask = async () => {
    if (trainingId !== null) {
      try {
        const response = await fetch('/api/userTraining/updateUserTrainingStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingId: parseInt(trainingId, 10), status: 'Completed', userId, comment: "Training completed." }),
        });
  
        if (response.ok) {
          // Update the status in the local state
          setUserTrainingStatus('Completed');
        } else {
          setError("Failed to update training status");
        }
      } catch (error) {
        setError(`Update training status error: ${error}`);
      }
    }
  };  

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trainingId || !training) {
    return <div>No training data found.</div>;
  }

  return (
    <>
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
            Training Completion
          </Typography>
        </Grid>
        {allStepsCompleted && (
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteTask}
              disabled={userTrainingStatus === 'Completed'} // Disable button when userTrainingStatus is 'Completed'
            >
              {userTrainingStatus === 'Completed' ? 'Training Completed' : 'Complete Training'}
            </Button>
          </Grid>
        )}
      </Grid>
      <Box mb={2}>
        <Tabs value={value} onChange={handleChange} aria-label="training tabs">
          <Tab label="Training Steps" />
          <Tab label="Audit Log" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CompleteTrainingTask />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Comment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.comment}</TableCell>
                  {log.newStatus === 'Pending' && <TableCell><Chip label="Pending" color="info" /></TableCell>}
                  {log.newStatus === 'Completed' && <TableCell><Chip label="Completed" color="success" /></TableCell>}
                  {log.newStatus === 'Failed' && <TableCell><Chip label="Failed" color="error" /></TableCell>}
                  <TableCell>{log.creator.name}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>
    </>
  );
};

export default function TrainingCompletePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <PageContainer title="Training Complete" description="this is Training Complete">
          <TrainingTask />
        </PageContainer>
      </Suspense>
    </ProtectedRoute>
  );
}
