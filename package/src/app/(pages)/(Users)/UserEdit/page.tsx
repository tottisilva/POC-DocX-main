// pages/create-training.tsx
'use client'
import React from 'react';
import { Container, Typography, Box, Card} from '@mui/material';
import EditUserForm from '@/app/(DashboardLayout)/myComponents/users/UserEditForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AddUser = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="User Edit" description="this is User Edit">
        <Typography component="h1" variant="h1" mb={5}> Edit User </Typography>
        <Card sx={{ p: 3 }}>
            
          <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
          <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

    <EditUserForm />

          </Box>
          </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default AddUser;