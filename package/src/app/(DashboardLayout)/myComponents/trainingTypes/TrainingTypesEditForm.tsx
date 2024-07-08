import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Container,
  Snackbar,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';

const EditTrainingTypeForm = () => {
  const [title, setTitle] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingTypeId = searchParams.get('id');

  useEffect(() => {
    const fetchTrainingType = async () => {
      try {
        const response = await fetch(`/api/trainingType/${trainingTypeId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
        } else {
          console.error('Failed to fetch training type details');
        }
      } catch (error) {
        console.error('Fetch training type error:', error);
      }
    };

    fetchTrainingType();
  }, [trainingTypeId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/trainingType/${trainingTypeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Training type updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/TrainingTypes'); // Redirect after success
        }, 1200); // Redirect after 3 seconds
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to update training type.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Update training type error:', error);
      setSnackbarMessage('An error occurred while updating the training type.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
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
          <Grid xs={12} sm={6} pr={1}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
            <Button variant="contained" fullWidth href="/TrainingTypes" color="inherit">
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
  );
};

export default EditTrainingTypeForm;
