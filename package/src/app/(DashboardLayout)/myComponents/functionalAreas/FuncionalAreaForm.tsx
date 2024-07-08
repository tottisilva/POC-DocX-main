import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {TextField, Button, Grid, Container, Box, Snackbar,} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default function AddFunctionalArea() {
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Check if code already exists
    try {
      const checkResponse = await fetch('/api/functionalArea/addFunctionalArea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setSnackbarMessage('Code already exists');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Add functional area
      const response = await fetch('/api/functionalArea/addFunctionalArea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, code }),
      });

      if (response.ok) {
        setSnackbarMessage('Functional area created successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/FunctionalAreas'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to add functional area');
        setSnackbarMessage('Failed to add functional area.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('An error occurred while creating the functional area.');
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
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
      >
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Code"
              name="code"
              autoComplete="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
            <Button variant="contained" fullWidth href="/FunctionalAreas" color="inherit">
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
