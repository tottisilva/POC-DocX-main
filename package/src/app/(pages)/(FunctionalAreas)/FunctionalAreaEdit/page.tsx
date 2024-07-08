'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import EditFunctionalAreaForm from '@/app/(DashboardLayout)/myComponents/functionalAreas/FunctionalAreaEditForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const EditFunctionalAreaPage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Functional Area Edit" description="this is Functional Area Edit">
    <Typography component="h1" variant="h1" mb={5}>Edit Functional Area</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

 <EditFunctionalAreaForm />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default EditFunctionalAreaPage;