'use client'

import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import AddFunctionalArea from '@/app/(DashboardLayout)/myComponents/functionalAreas/FuncionalAreaForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const AddFunctionalAreaPage = () => {
  return (
    <ProtectedRoute>
      <PageContainer title="Functional Area Detail" description="this is Functional Area Detail">
    <Typography component="h1" variant="h1" mb={5}>Create Functional Area</Typography>
     <Card sx={{ p: 3 }}>
        
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

<AddFunctionalArea />

      </Box>
      </Card>
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default AddFunctionalAreaPage;