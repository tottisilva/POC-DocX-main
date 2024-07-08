"use client"
import TrainingForm from '@/app/(DashboardLayout)/myComponents/trainings/TrainingForm';
import React from 'react';
import { Typography, Grid, Card} from '@mui/material';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

export default function TrainingsFormPage() {

  return (
    <ProtectedRoute>
      <PageContainer title="Training Detail" description="this is Training Detail">
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
          Create Training
          </Typography>
        </Grid>
      </Grid>
      <Card sx={{ p: 3 }}>      
      <Typography component="h1" variant="h5" mb={1}> Detail </Typography>

        <TrainingForm />


      </Card>
      </PageContainer>
    </ProtectedRoute>
  )
}