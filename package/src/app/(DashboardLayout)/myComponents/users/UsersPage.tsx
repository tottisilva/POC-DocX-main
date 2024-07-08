'use client';

import { useEffect, useState, Suspense } from 'react';
import LoadingComponent from '../../layout/loading/Loading';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import UsersList from './UsersList';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

type User = {
  id: number;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: {
    name: string;
  } | null;
};

type UsersData = {
  users: User[];
  totalUsers: number;
  page: number;
  pageSize: number;
};

function UsersPageContent() {
  const searchParams = useSearchParams();
  const [usersData, setUsersData] = useState<UsersData>({ users: [], totalUsers: 0, page: 1, pageSize: 10 });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const role = searchParams.get('role') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    async function fetchUsers() {
      const response = await fetch(`/api/users/getUsersPaginated?page=${page}&pageSize=${pageSize}&role=${role}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) {
        console.error('Failed to fetch users data');
        return;
      }
      const data = await response.json();
      setUsersData(data);
    }

    fetchUsers();
  }, [searchParams]);

  return (
    <PageContainer title="Users" description="This is Users">
      <UsersList 
        users={usersData.users} 
        totalUsers={usersData.totalUsers} 
        page={usersData.page} 
        pageSize={usersData.pageSize}
        sortBy={searchParams.get('sortBy') || 'name'}
        sortOrder={searchParams.get('sortOrder') || 'asc'}
      />
    </PageContainer>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <UsersPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
