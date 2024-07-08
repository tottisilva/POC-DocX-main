'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import FunctionalAreaList from './FunctionalAreaList'; // Ensure you have a corresponding component
import LoadingComponent from '../../layout/loading/Loading';

type FunctionalArea = {
  id: number;
  name: string;
  code: string;
};

type FunctionalAreaData = {
  functionalAreas: FunctionalArea[];
  totalFunctionalAreas: number;
  page: number;
  pageSize: number;
};

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

function FunctionalAreaPageContent() {
  const searchParams = useSearchParams();
  const [functionalAreasData, setFunctionalAreasData] = useState<FunctionalAreaData>({
    functionalAreas: [],
    totalFunctionalAreas: 0,
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const fetchFunctionalAreas = async () => {
      try {
        const response = await fetch(`/api/functionalArea/getFunctionalAreasPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        if (!response.ok) {
          console.error('Failed to fetch Functional Areas data');
          return;
        }
        const data: FunctionalAreaData = await response.json();
        setFunctionalAreasData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFunctionalAreas();
  }, [searchParams]);

  return (
    <FunctionalAreaList 
      functionalAreas={functionalAreasData.functionalAreas}
      totalFunctionalAreas={functionalAreasData.totalFunctionalAreas}
      page={functionalAreasData.page}
      pageSize={functionalAreasData.pageSize}
      sortBy={searchParams.get('sortBy') || 'name'}
      sortOrder={searchParams.get('sortOrder') || 'asc'}
    />
  );
}

export default function FunctionalAreaPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <FunctionalAreaPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
