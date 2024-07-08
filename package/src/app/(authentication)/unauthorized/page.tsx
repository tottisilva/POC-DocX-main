'use client';

import { Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
    <Grid container direction="row" justifyContent="center" alignItems="center" height={'100vh'}>
      <div>
      <Grid>
        <ReportProblemOutlinedIcon className='Icon-lg'/>
        <Typography variant="h3" component="h1" gutterBottom textAlign={'center'}>
          Unauthorized
        </Typography>
        <Typography variant="body1" gutterBottom textAlign={'center'}>
          You are not authorized to view this page. Please login to continue.
        </Typography>
        </Grid>
        <Grid container direction="row" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color='primary'
          onClick={handleLogin}
        >
          Login
        </Button>
        </Grid>
      </div>
    </Grid>
    </Container>
  );
};

export default UnauthorizedPage;
