import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

type Role = {
  id: number;
  name: string;
};

const EditUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
          setPassword(data.password);
          setRoleId(data.roleId); // Ensure roleId is correctly set
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Fetch user error:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
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
        setSnackbarMessage('User updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/Users'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        console.error('Failed to update user');
        setSnackbarMessage('Failed to update user');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Update user error:', error);
      setSnackbarMessage('An error occurred while updating the user.');
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
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
              <InputLabel id="roleId-label">Role</InputLabel>
              <Select
                labelId="roleId-label"
                id="roleId"
                value={roleId}
                label="Role"
                onChange={(e) => setRoleId(e.target.value)}
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
          <Grid item xs={0} md={7}></Grid>
          <Grid container display={'flex'} justifyContent={'flex-end'}>
            <Grid item xs={6} md={2} pr={2}>
              <Button variant="contained" fullWidth href="/Users" color="inherit">Back</Button>
            </Grid>
            <Grid item xs={6} md={2} pl={1}>
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

export default EditUserForm;
