import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Grid, Container, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import LoadingComponent from '../../layout/loading/Loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CreateQuiz from '../quiz/Quiz';
import DocumentsTab from '../documents/AssignDocumentToTraining';
import { SelectChangeEvent } from '@mui/material';

type TrainingType = {
  id: number;
  title: string;
};

type TrainingStep = {
  id: number;
  description: string;
  url: string;
  typeId: number;
  stepNumber: number;
};

interface TrainingStepFormProps {
  trainingId: number | null;
  stepNumber: number;
  description: string;
  url: string;
  typeId: number;
  trainingSteps: TrainingStep[];
}

const TrainingStepForm: React.FC<TrainingStepFormProps> = ({ stepNumber, description, url, typeId, trainingSteps }) => {
  const { data: session, status } = useSession();
  const [localDescription, setLocalDescription] = useState<string>(description ?? '');
  const [localUrl, setLocalUrl] = useState<string>(url ?? '');
  const [localTypeId, setLocalTypeId] = useState<number | null>(null);
  const [localTypeName, setLocalTypeName] = useState<string | null>(null);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [trainingStepId, setTrainingStepId] = useState<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingId = parseInt(searchParams.get('trainingId') || '');

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await fetch('/api/trainingType/getTrainingType');
        if (response.ok) {
          const data: TrainingType[] = await response.json();
          setTrainingTypes(data);
        } else {
          console.error('Failed to fetch training types');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching training types:', error);
        setLoading(false);
      }
    };

    fetchTrainingTypes();
  }, []);

  useEffect(() => {
    const fetchStepData = () => {
      if (!trainingId || trainingSteps.length === 0) return;

      const step = trainingSteps.find(step => step.stepNumber === stepNumber);
      if (step) {
        setLocalDescription(step.description);
        setLocalUrl(step.url);
        setTrainingStepId(step.id);

        const correspondingType = trainingTypes.find(type => type.id === step.typeId);
        if (correspondingType) {
          setLocalTypeId(step.typeId);
          setLocalTypeName(correspondingType.title);
        } else {
          console.warn(`Training type with ID ${step.typeId} not found.`);
        }
      }
    };

    fetchStepData();
  }, [trainingId, stepNumber, trainingSteps, trainingTypes]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!localDescription || !localTypeId) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    if (localTypeName === 'Video' && !localUrl) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('/api/steps/addSteps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: localDescription,
          typeId: localTypeId,
          url: localUrl,
          trainingId: trainingId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const trainingStepId = data.id; 
        router.push(`/TrainingStepEdit?id=${trainingStepId}&trainingId=${trainingId}`);
      } else {
        console.error('Failed to save training step');
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to save training step');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error saving training step:', error);
      setSnackbarMessage('Failed to save training step');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<number | null>) => {
    const selectedId = event.target.value as number;
    const selectedType = trainingTypes.find(type => type.id === selectedId);

    if (selectedType) {
      setLocalTypeId(selectedId);
      setLocalTypeName(selectedType.title);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingComponent />;
  }

  if (status === 'unauthenticated') {
    return <p>You need to be authenticated to create or edit a training step.</p>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container component="main">
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
                {snackbarMessage}
              </MuiAlert>
            </Snackbar>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
              <Grid item xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  autoFocus
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="url"
                  label="Url"
                  name="url"
                  autoComplete="url"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Training Type</InputLabel>
                  <Select
                    labelId="typeId-label"
                    id="typeId"
                    value={localTypeId}
                    label="Training Type"
                    onChange={handleSelectChange}
                  >
                    {trainingTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2} justifyContent="flex-end">
              <Grid item xs={6} sm={2} pr={2}>
                <Button variant="contained" fullWidth onClick={() => router.push(`/TrainingEdit?id=${trainingId}&CreateIcon`)} color="inherit">Back</Button>
              </Grid>
              <Grid item xs={6} sm={2} pl={1}>
                <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TrainingStepForm;
