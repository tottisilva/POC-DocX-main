'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import GroupNameList from './GroupNameList'; // Ensure you have a corresponding component
import LoadingComponent from '../../layout/loading/Loading';

type GroupName = {
  id: number;
  name: string;
  code: string;
};

type GroupNameData = {
  groupNames: GroupName[];
  totalGroupNames: number;
  page: number;
  pageSize: number;
};

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

function GroupNamePageContent() {
  const searchParams = useSearchParams();
  const [groupNamesData, setGroupNamesData] = useState<GroupNameData>({
    groupNames: [],
    totalGroupNames: 0,
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const fetchGroupNames = async () => {
      try {
        const response = await fetch(`/api/groupName/getGroupNamesPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        if (!response.ok) {
          console.error('Failed to fetch Group Names data');
          return;
        }
        const data: GroupNameData = await response.json();
        setGroupNamesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupNames();
  }, [searchParams]);

  return (
    <GroupNameList 
      groupNames={groupNamesData.groupNames}
      totalGroupNames={groupNamesData.totalGroupNames}
      page={groupNamesData.page}
      pageSize={groupNamesData.pageSize}
      sortBy={searchParams.get('sortBy') || 'name'}
      sortOrder={searchParams.get('sortOrder') || 'asc'}
    />
  );
}

export default function GroupNamePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <GroupNamePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
