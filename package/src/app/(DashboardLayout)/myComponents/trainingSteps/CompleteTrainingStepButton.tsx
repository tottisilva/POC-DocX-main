import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

interface CompleteStepButtonProps {
  userId: string;
  trainingStepId: number;
  trainingId: number;
}

interface UserTrainingStep {
  id: number;
  trainingId: number;
  userId: number;
  trainingStepId: number;
  stepStatus: 'Completed' | 'Pending' | 'Failed';
}

const CompleteStepButton: React.FC<CompleteStepButtonProps> = ({ userId, trainingStepId, trainingId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [userTrainingStatus, setUserTrainingStatus] = useState<string>('');
  const [userTrainingStepStatus, setUserTrainingStepStatus] = useState<string>('Pending');

  useEffect(() => {
    const fetchUserTrainingStepStatus = async () => {
      try {
        const response = await fetch('/api/userTrainingSteps/getUserTrainingStepStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingStepId, userId }),
        });
    
        if (response.ok) {
          const data: UserTrainingStep = await response.json();
          setUserTrainingStepStatus(data.stepStatus); // Update status correctly
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
      fetchUserTrainingStepStatus();
    }
  }, [trainingStepId, userId]);

  const refreshUserTrainingStatus = () => {
    // Fetch user training status again
    fetch('/api/userTraining/getUserTrainingStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trainingId, userId }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch UserTraining status');
        }
      })
      .then(data => {
        setUserTrainingStatus(data.status);
      })
      .catch(error => {
        setError(`Error fetching UserTraining status: ${error}`);
      });
  };

  const handleCompleteStep = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/userTrainingSteps/updateUserTrainingStepStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          trainingStepId,
          status: 'Completed', // Assuming 'Completed' for successful completion
        }),
      });

      if (response.ok) {
        setCompleted(true); // Update UI to reflect completion
        setUserTrainingStepStatus('Completed'); // Update local state to avoid additional fetch for status
        refreshUserTrainingStatus(); // Refresh user training status after step completion
      } else {
        setError('Failed to update UserTrainingStep status');
      }
    } catch (error) {
      setError(`Error updating UserTrainingStep status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCompleteStep}
        disabled={loading || completed || userTrainingStepStatus === 'Completed'}
      >
        {loading ? 'Completing...' : userTrainingStepStatus === 'Completed' ? 'Completed' : 'Complete Step'}
      </Button>
    </>
  );
};

export default CompleteStepButton;