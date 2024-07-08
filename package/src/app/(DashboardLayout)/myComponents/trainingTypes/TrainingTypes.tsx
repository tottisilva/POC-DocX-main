'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import TrainingTypeList from './TrainingTypesList';
import LoadingComponent from '../../layout/loading/Loading';

type TrainingType = {
  id: number;
  title: string | null;
  category: string;
  createdAt: Date;
};

type TrainingTypeData = {
  trainingTypes: TrainingType[];
  totalTrainingTypes: number;
  page: number;
  pageSize: number;
};

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

function TrainingTypePageContent() {
  const searchParams = useSearchParams();
  const [trainingTypesData, setTrainingTypesData] = useState<TrainingTypeData>({ trainingTypes: [], totalTrainingTypes: 0, page: 1, pageSize: 10 });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const fetchTrainingTypes = async () => {
      try {
        const response = await fetch(`/api/trainingType/getTrainingTypesPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        if (!response.ok) {
          console.error('Failed to fetch Training Types data');
          return;
        }
        const data = await response.json();
        setTrainingTypesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTrainingTypes();
  }, [searchParams]);

  return (
    <TrainingTypeList 
      trainingTypes={trainingTypesData.trainingTypes}
      totalTrainingTypes={trainingTypesData.totalTrainingTypes} 
      page={trainingTypesData.page} 
      pageSize={trainingTypesData.pageSize}
      sortBy={searchParams.get('sortBy') || 'title'}
      sortOrder={searchParams.get('sortOrder') || 'asc'}
    />
  );
}

export default function TrainingTypePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <TrainingTypePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
