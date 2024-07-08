'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import AddGroupName from '@/app/(DashboardLayout)/myComponents/groupNames/GroupNameForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AddGroupNamePage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Group Name Detail" description="this is Group Name">
    <Typography component="h1" variant="h1" mb={5}>Create Group Name</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

<AddGroupName />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default AddGroupNamePage;