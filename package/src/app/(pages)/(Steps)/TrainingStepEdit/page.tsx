'use client';

import TrainingStepEdit from '@/app/(DashboardLayout)/myComponents/trainingSteps/TrainingStepEdit';
import React from 'react';
import { Typography, Box, Card } from '@mui/material';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Suspense } from "react";
import LoadingComponent from "@/app/(DashboardLayout)/layout/loading/Loading";

const TrainingStepEditContent = () => {
    return (
        <>
            <Typography component="h1" variant="h1" mb={5}> Edit Step </Typography>
                <TrainingStepEdit />
        </>
    );
}

export default function TrainingsFormPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<LoadingComponent />}>
                <PageContainer title="Training Detail" description="this is Training Detail">
                    <TrainingStepEditContent />
                </PageContainer>
            </Suspense>
        </ProtectedRoute>
    )
}
