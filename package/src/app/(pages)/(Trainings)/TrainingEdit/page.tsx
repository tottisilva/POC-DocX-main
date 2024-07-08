'use client'

import React, { useState } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import EditTrainingTabs from '@/app/(DashboardLayout)/myComponents/trainings/TrainingTabs';
import { Grid, Typography } from '@mui/material';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

const EditTrainingPage = () => {

  return (
    <ProtectedRoute>
      <PageContainer title="Daily Log Edit" description="this is Daily Log Edit">
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
          Edit Training
          </Typography>
        </Grid>
      </Grid>
        <EditTrainingTabs />
      </PageContainer>
    </ProtectedRoute>
     ); 
};

export default EditTrainingPage;