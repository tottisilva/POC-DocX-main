'use client';

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import AddRoleForm from '@/app/(DashboardLayout)/myComponents/roles/RolesForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AddRolePage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Role Detail" description="this is Role Detail">
     <Typography component="h1" variant="h1" mb={5}>Create Role</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

    <AddRoleForm />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default AddRolePage;