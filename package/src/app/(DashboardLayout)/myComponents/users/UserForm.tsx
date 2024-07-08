'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Select, 
  InputLabel, 
  FormControl, 
  TextField, 
  Button, 
  Grid, 
  Box, 
  MenuItem,
  Snackbar
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type Role = {
  id: number;
  name: string;
};

const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles/getRoles');
      if (response.ok) {
        const data: Role[] = await response.json();
        setRoles(data);
      } else {
        console.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Fetch roles error:', error);
    }
  };

  useEffect(() => { 
    fetchRoles();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/users/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          roleId: parseInt(roleId, 10)
        }),
      });

      if (response.ok) {
        setSnackbarMessage('User created successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Users'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to create user');
        setSnackbarMessage('Failed to create user');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Create user error:', error);
      setSnackbarMessage('An error occurred while creating the user.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
          <Grid item xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}> 
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
          <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              id="email"
              margin="normal"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} pr={{ xs: 0, sm: 1, md: 1 }}>
            <TextField
              id="password"
              margin="normal"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid xs={12} sm={6} pl={{ xs: 0, sm: 1, md: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="typeId-label">Role</InputLabel>
              <Select
                labelId="roleId-label"
                id="roleId"
                value={roleId}
                label="Role"
                onChange={(e) => setRoleId(e.target.value as string)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2} display={'flex'} justifyContent={'flex-end'}>
          <Grid xs={0} md={7}></Grid>
          <Grid container  display={'flex'} justifyContent={'flex-end'}>
            <Grid xs={6} md={2} pr={2}>
              <Button variant="contained" fullWidth href="/Users" color="inherit">Back</Button>
            </Grid>
            <Grid xs={6} md={2} pl={1}>
              <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
            </Grid>
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
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ color: 'white' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default AddUserForm;
