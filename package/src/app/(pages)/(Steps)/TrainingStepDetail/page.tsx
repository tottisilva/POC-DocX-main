'use client';

import TrainingStepForm from "@/app/(DashboardLayout)/myComponents/trainingSteps/TrainingStepForm";
import React from 'react';
import { Typography, Box, Card } from '@mui/material';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import LoadingComponent from "@/app/(DashboardLayout)/layout/loading/Loading";

const TrainingsStepFormContent = () => {
    const searchParams = useSearchParams();
    const trainingId = searchParams.get('trainingId');

    return (
        <>
            <Typography component="h1" variant="h1" mb={5}> Create Step </Typography>
            <Card sx={{ p: 3 }}>      
                <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
                <TrainingStepForm 
                    trainingId={trainingId ? Number(trainingId) : null} // Convert trainingId to number if it exists
                    stepNumber={0} 
                    description={""} 
                    url={""} 
                    typeId={0} 
                    trainingSteps={[]} 
                />
            </Card>
        </>
    );
}

export default function TrainingsStepFormPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<LoadingComponent />}>
                <PageContainer title="Training Detail" description="This is Training Detail">
                    <TrainingsStepFormContent />
                </PageContainer>
            </Suspense>
        </ProtectedRoute>
    )
}
