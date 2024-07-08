import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Grid, Container, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function AddGroupName() {
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/groupName/addGroupName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, code }),
      });

      if (response.ok) {
        setSnackbarMessage('GroupNames created successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/GroupNames'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to create GroupNames');
        setSnackbarMessage( 'Failed to create GroupNames.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('An error occurred while creating the GroupNames.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <Container component="main">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end" mt={2}>
          <Grid item>
            <Button variant="contained" href="/GroupNames" color="inherit">
              Back
            </Button>
          </Grid>
          <Grid item>
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
