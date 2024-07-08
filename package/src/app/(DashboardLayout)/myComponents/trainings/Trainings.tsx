'use client';

import { useSearchParams } from 'next/navigation';
import LoadingComponent from "@/app/(DashboardLayout)/layout/loading/Loading";
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import TrainingList from './TrainingList';
import { Suspense } from 'react';


function TrainingsPageContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  return (
          <TrainingList
            page={page}
            pageSize={pageSize}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
  );
}

export default function TrainingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <PageContainer title="Trainings" description="This is Trainings Page">
          <TrainingsPageContent />  
        </PageContainer>
      </Suspense>
    </ProtectedRoute>
  );
}
