import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Grid,
  Container,
  Box,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function AddTrainingType() {
  const [title, setTitle] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/trainingType/addTrainingType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setSnackbarMessage('Training type added successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/TrainingTypes'); // Redirect after 3 seconds
        }, 1200);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to add training type.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Add training type error:', error);
      setSnackbarMessage('An error occurred while adding the training type.');
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
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
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
}
