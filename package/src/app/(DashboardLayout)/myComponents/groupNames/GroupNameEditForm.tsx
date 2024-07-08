import React, { useState, FormEvent, useEffect} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Grid, Container, Box, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddGroupName() {
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const router = useRouter();
  const searchParams = useSearchParams();
  const groupNameId = searchParams.get('id');

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const response = await fetch(`/api/groupName/${groupNameId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setCode(data.code);
        } else {
          console.error('Failed to fetch group Name details');
        }
      } catch (error) {
        console.error('Fetch group Name error:', error);
      }
    };

    fetchGroupName();
  }, [groupNameId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const checkResponse = await fetch('/api/groupName/addGroupName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setSnackbarMessage('Code already exists');
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(`/api/groupName/${groupNameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, code }),
      });

      if (response.status === 409) {
        setSnackbarMessage('Code already exists');
        setOpenSnackbar(true);
        return;
      }

      if (response.ok) {
        setSnackbarMessage('Group name updated successfully.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push('/GroupNames'); // Redirect after 1200 milliseconds
        }, 1200);
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Failed to update group name');
        setSnackbarSeverity('error')
        setOpenSnackbar(true);

      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('An error occurred while updating the group name');
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
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          mt={2}
        >
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
