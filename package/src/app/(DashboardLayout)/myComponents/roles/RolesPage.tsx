'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import RolesList from './RolesList';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import LoadingComponent from '../../layout/loading/Loading';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

type Role = {
  id: number;
  name: string | null;
};

type RolesData = {
  roles: Role[];
  totalRoles: number;
  page: number;
  pageSize: number;
};

function RolesPageContent() {
  const searchParams = useSearchParams();
  const [rolesData, setRolesData] = useState<RolesData>({ roles: [], totalRoles: 0, page: 1, pageSize: 10 });
  
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    async function fetchRoles() {
      const response = await fetch(`/api/roles/getRolesPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) {
        console.error('Failed to fetch roles data');
        return;
      }
      const data = await response.json();
      setRolesData(data);
    }

    fetchRoles();
  }, [searchParams]);

  return (
    <PageContainer title="Roles" description="This is Roles">
      <RolesList 
        roles={rolesData.roles} 
        totalRoles={rolesData.totalRoles} 
        page={rolesData.page} 
        pageSize={rolesData.pageSize}
        sortBy={searchParams.get('sortBy') || 'name'}
        sortOrder={searchParams.get('sortOrder') || 'asc'}
      />
    </PageContainer>
  );
}

export default function RolesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <RolesPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
