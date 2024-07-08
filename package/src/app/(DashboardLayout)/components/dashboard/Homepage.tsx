'use client';

import { useEffect, useState, Suspense } from 'react';
import LoadingComponent from '../../layout/loading/Loading';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Switch, FormControlLabel, Grid, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import AllTrainingsTable from './HomepageAllTrainingsList';
import UserTrainingsTable from './HomepageMandatoryList';
import AllUserTrainingsTable from './HomepageAllUserTrainingsList';

type Training = {
  id: number;
  description: string;
  createdAt: Date;
  status: string;
  createdBy: number;
};

type UserTraining = {
  userId: number;
  trainingId: number;
  status: string;
  createdAt: Date;
  createdBy: number;
  user: {
    name: string;
  };
  training: {
    description: string;
    trainingType: {
      id: number;
      title: string;
    };
  };
};

type TrainingData = {
  trainings: Training[];
  totalTrainings: number;
  page: number;
  pageSize: number;
};

type UserTrainingData = {
  userTrainings: UserTraining[];
  totalUserTrainings: number;
  page: number;
  pageSize: number;
};

function UserTrainingPageContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id ? parseInt(session.user.id as string, 10) : null;
  const [trainingData, setTrainingData] = useState<TrainingData>({
    trainings: [],
    totalTrainings: 0,
    page: 1,
    pageSize: 10,
  });
  const [userTrainingData, setUserTrainingData] = useState<UserTrainingData>({
    userTrainings: [],
    totalUserTrainings: 0,
    page: 1,
    pageSize: 10,
  });
  const [allUserTrainingData, setAllUserTrainingData] = useState<UserTrainingData>({
    userTrainings: [],
    totalUserTrainings: 0,
    page: 1,
    pageSize: 10,
  });
  const [showAllTrainings, setShowAllTrainings] = useState(true);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const fetchAllTrainings = async () => {
      const response = await fetch(`/api/trainings/getTrainingsPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (response.ok) {
        const data = await response.json();
        setTrainingData(data);
      } else {
        console.error('Failed to fetch all trainings');
      }
    };

    const fetchUserTrainings = async () => {
      const response = await fetch(`/api/userTraining/getUserTrainingsPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&userId=${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setUserTrainingData(data);
      } else {
        console.error('Failed to fetch user trainings');
      }
    };

    const fetchAllUserTrainings = async () => {
      const response = await fetch(`/api/userTraining/getAllUserTrainingsPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (response.ok) {
        const data = await response.json();
        setAllUserTrainingData(data);
      } else {
        console.error('Failed to fetch all user trainings');
      }
    };

    if (session?.user.role === 'Manager') {
      if (showAllTrainings) {
        fetchAllTrainings();
      } else {
        fetchAllUserTrainings();
      }
    } else {
      if (showAllTrainings) {
        fetchAllTrainings();
      } else if (loggedInUserId) {
        fetchUserTrainings();
      }
    }
  }, [searchParams, showAllTrainings, loggedInUserId, session?.user.role]);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllTrainings(event.target.checked);
  };

  return (
    <PageContainer title="User Trainings" description="This is User Trainings Page">
      <Grid container spacing={2} mb={5} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography component="h1" variant="h1">
            Home
          </Typography>
        </Grid>
        <Grid item container xs={12} md={4} gap={2} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid item xs={12} md="auto">
            {session?.user.role === 'Manager' ? 'Assigned Trainings' : 'My Trainings'}
          </Grid>
          <Grid item xs={12} md="auto">
            <FormControlLabel
              control={<Switch checked={showAllTrainings} onChange={handleToggle} />}
              label={'All'}
            />
          </Grid>
        </Grid>
      </Grid>
      {session?.user.role === 'Manager' && !showAllTrainings ? (
        <AllUserTrainingsTable 
          userTrainings={allUserTrainingData.userTrainings} 
          totalUserTrainings={allUserTrainingData.totalUserTrainings} 
          page={allUserTrainingData.page} 
          pageSize={allUserTrainingData.pageSize} 
          sortBy={searchParams.get('sortBy') || 'createdAt'}
          sortOrder={searchParams.get('sortOrder') || 'asc'} 
        />
      ) : showAllTrainings ? (
        <AllTrainingsTable
          trainings={trainingData.trainings}
          totalTrainings={trainingData.totalTrainings}
          page={trainingData.page}
          pageSize={trainingData.pageSize}
          sortBy={searchParams.get('sortBy') || 'createdAt'}
          sortOrder={searchParams.get('sortOrder') || 'asc'}
        />
      ) : (
        <UserTrainingsTable
          userTrainings={userTrainingData.userTrainings}
          totalUserTrainings={userTrainingData.totalUserTrainings}
          page={userTrainingData.page}
          pageSize={userTrainingData.pageSize}
          sortBy={searchParams.get('sortBy') || 'createdAt'}
          sortOrder={searchParams.get('sortOrder') || 'asc'}
        />
      )}
    </PageContainer>
  );
}

export default function UserTrainingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingComponent />}>
        <UserTrainingPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
