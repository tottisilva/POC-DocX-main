'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import EditTrainingTypeForm from '@/app/(DashboardLayout)/myComponents/trainingTypes/TrainingTypesEditForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const EditTrainingTypePage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Training Type Edit" description="this is Training Type Edit">
    <Typography component="h1" variant="h1" mb={5}>Edit Training Type</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

 <EditTrainingTypeForm />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default EditTrainingTypePage;