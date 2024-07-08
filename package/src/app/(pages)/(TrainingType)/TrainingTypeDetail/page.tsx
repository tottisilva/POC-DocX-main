'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import AddTrainingType from '@/app/(DashboardLayout)/myComponents/trainingTypes/TrainingTypeForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AddTrainingTypePage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Training Types" description="this is Training Types">
    <Typography component="h1" variant="h1" mb={5}>Create Training Type</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

<AddTrainingType />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default AddTrainingTypePage;