import React, { useState, useEffect } from 'react';
import {TextField, Button, Box, Grid, Container, Snackbar} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';

const EditFunctionalAreaForm = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const searchParams = useSearchParams();
  const functionalAreaId = searchParams.get('id');

  useEffect(() => {
    const fetchFunctionalArea = async () => {
      try {
        const response = await fetch(`/api/functionalArea/${functionalAreaId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setCode(data.code);
        } else {
          console.error('Failed to fetch functional area details');
        }
      } catch (error) {
        console.error('Fetch functional area error:', error);
      }
    };

    fetchFunctionalArea();
  }, [functionalAreaId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if the code already exists for another functional area
    try {
      const checkResponse = await fetch(`/api/functionalArea/addFunctionalArea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, id: functionalAreaId }), // Pass the id to bypass the current functional area
      });

      const checkData = await checkResponse.json();
      if (checkData.exists) {
        setSnackbarMessage('Code already exists for another functional area.');
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`/api/functionalArea/${functionalAreaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          code,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Functional area updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/FunctionalAreas'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to update functional area');
        setSnackbarMessage('Failed to update functional area.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Update functional area error:', error);
      setSnackbarMessage('An error occurred while updating the functional area.');
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
          <Grid item xs={12} sm={6} pr={1}>
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
          <Grid item xs={12} sm={6} pr={1}>
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
          <Grid item xs={7}></Grid>
          <Grid item xs={2}>
            <Button variant="contained" fullWidth href="/FunctionalAreas" color="inherit">
              Back
            </Button>
          </Grid>
          <Grid item xs={2}>
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

export default EditFunctionalAreaForm;
