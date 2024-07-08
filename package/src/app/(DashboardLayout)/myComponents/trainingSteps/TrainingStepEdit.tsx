import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Typography, TextField, Button, Box, Grid, Container, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import CreateQuiz from '../quiz/Quiz';
import DocumentsTab from '../documents/AssignDocumentToTraining';

type TrainingType = {
  id: number;
  title: string;
};

type TrainingStep = {
  id: number;
  description: string;
  url: string;
  trainingType: {
    id: number;
    title: string;
  };
  stepNumber: number;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TrainingStepTabs: React.FC = () => {
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [stepNumber, setStepNumber] = useState<number | undefined>(undefined);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [localTypeId, setLocalTypeId] = useState<number | null>(null);
  const [localTypeName, setLocalTypeName] = useState<string | null>(null);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingStepId = Number(searchParams.get('id')); 
  const trainingId = Number(searchParams.get('trainingId')); 

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
    if (trainingStepId) {
      fetchTrainingStepDetails();
    }
  }, [trainingStepId]);

  const fetchTrainingStepDetails = async () => {
    try {
      const response = await fetch(`/api/steps/${trainingStepId}`);

      if (response.ok) {
        const data = await response.json();
        setDescription(data.description);
        setUrl(data.url);
        setStepNumber(data.stepNumber);
        setLocalTypeId(data.typeId);
        setLocalTypeName(data.trainingType.title);
      } else {
        console.error('Failed to fetch training step details');
      }
    } catch (error) {
      console.error('Fetch training step error:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!description || !localTypeId) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    if (localTypeName === 'Video' && !url) {
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`/api/steps/${trainingStepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          url,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Training step updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push(`/TrainingEdit?id=${trainingId}&tab=1`);
        }, 1200); // Redirect after 1.2 seconds
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to update training step.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Update training step error:', error);
      setSnackbarMessage('An error occurred while updating the training step.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  let selectedComponent = null;

  switch (localTypeName) {
    case 'Quiz':
      selectedComponent = <CreateQuiz trainingStepId={trainingStepId} />;
      break;
    case 'R&U':
      selectedComponent = <DocumentsTab trainingStepId={trainingStepId} />;
      break;
    default:
      selectedComponent = null;
  }

  return (
    <>
    <Box mb={2}>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Details" />
        {localTypeName}
        {localTypeName != 'Video' && <Tab label={localTypeName} />}
      </Tabs>
    </Box>
      <Card>
      <CustomTabPanel value={value} index={0}>
      <Container component="main">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="url"
              label="URL"
              name="url"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              id="stepNumber"
              label="Step Number"
              name="stepNumber"
              autoComplete="stepNumber"
              value={stepNumber === undefined ? '' : stepNumber}
              onChange={(e) => setStepNumber(parseInt(e.target.value))}
            />
          </Grid>
          <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
          <FormControl fullWidth margin="normal">
                  <InputLabel>Training Type</InputLabel>
                  <Select
                    labelId="typeId-label"
                    id="typeId"
                    value={localTypeId}
                    label="Training Type"
                    onChange={(e) => setLocalTypeId(Number(e.target.value))}
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
        <Grid
          container
          rowSpacing={1}
          gap={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          mt={2}
          display={'flex'}
          justifyContent={'flex-end'}
        >
          <Grid xs={7}></Grid>
          <Grid xs={2}>
            <Button variant="contained" fullWidth href={`/TrainingEdit?id=${trainingId}&tab=1`} color="inherit">
              Back
            </Button>
          </Grid>
          <Grid xs={2}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          sx={{ color: 'white' }}
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {selectedComponent}
      </CustomTabPanel>
      </Card>
    </>
  );
};

export default TrainingStepTabs;
