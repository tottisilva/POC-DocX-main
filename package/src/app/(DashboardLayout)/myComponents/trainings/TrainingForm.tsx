'use-client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Grid, Container, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import MuiAlert from '@mui/material/Alert';
import LoadingComponent from '../../layout/loading/Loading';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

type TrainingType = {
  id: number;
  title: string;
};

const TrainingForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [userId, setUserId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [hours, setHours] = useState('');
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [status, session]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!description ) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('/api/trainings/addTraining', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          url,
          userId: parseInt(userId, 10),
          file: Buffer.from([]),
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Training updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Trainings'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to create training');
        const errorData = await response.json();
        setSnackbarMessage(errorData.error);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error creating training:', error);
      setSnackbarMessage('Failed to create training');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (status === 'loading' || loading) {
    return <LoadingComponent />;
  }

  if (status === 'unauthenticated') {
    return <p>You need to be authenticated to create a training.</p>;
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
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
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
                fullWidth
                id="url"
                label="Url"
                name="url"
                autoComplete="Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Grid>
            
          </Grid>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2} display={'flex'} justifyContent={'flex-end'}>
            <Grid xs={0} md={7}></Grid>
            <Grid container  display={'flex'} justifyContent={'flex-end'}>
              <Grid xs={6} md={2} pr={2}>
                <Button variant="contained" fullWidth href="/Trainings" color="inherit">Back</Button>
              </Grid>
              <Grid xs={6} md={2} pl={1}>
                <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
              </Grid>
            </Grid>
            </Grid>
        </Box>
      </Container>
      </Box>
    </>
  );
};

export default TrainingForm;