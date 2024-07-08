'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import EditGroupNameForm from '@/app/(DashboardLayout)/myComponents/groupNames/GroupNameEditForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const EditGroupNamePage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Group Name Edit" description="this is Group Name Edit">
    <Typography component="h1" variant="h1" mb={5}>Edit Group Name</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

    <EditGroupNameForm />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default EditGroupNamePage;