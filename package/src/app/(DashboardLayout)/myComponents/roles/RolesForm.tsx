import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Grid, Container, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const AddRoleForm = () => {
  const [role, setRole] = useState({
    name: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRole(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/roles/addRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
      });

      if (response.ok) {
        setSnackbarMessage('Role added successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Roles'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to add role.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Add role error:', error);
      setSnackbarMessage('An error occurred while adding the role.');
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
                value={role.name}
                onChange={handleChange}
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

export default AddRoleForm;
