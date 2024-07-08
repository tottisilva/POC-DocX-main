import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Grid, Container, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const EditRoleForm = () => {
  const [name, setName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get('id');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch(`/api/roles/${roleId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
        } else {
          console.error('Failed to fetch role details');
        }
      } catch (error) {
        console.error('Fetch role error:', error);
      }
    };

    fetchRole();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Role updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Roles'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to update role.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Update role error:', error);
      setSnackbarMessage('An error occurred while updating the role.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
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
                id="name"
                margin="normal"
                name="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                required
                autoFocus
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
            <Grid xs={0} md={7}></Grid>
            <Grid container display={'flex'} justifyContent={'flex-end'}>
              <Grid xs={6} md={2} pr={2}>
                <Button variant="contained" fullWidth href="/Roles" color="inherit">
                  Back
                </Button>
              </Grid>
              <Grid xs={6} md={2} pl={1}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
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
    </>
  );
};

export default EditRoleForm;
