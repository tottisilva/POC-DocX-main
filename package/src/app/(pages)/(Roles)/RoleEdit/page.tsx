// pages/create-training.tsx
'use client'
import React from 'react';
import { Typography, Box, Card} from '@mui/material';
import EditRoleForm from '@/app/(DashboardLayout)/myComponents/roles/RolesEditForm';
import ProtectedRoute from '@/app/(authentication)/ProtectedRoute';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const EditRolePage = () => {
  return (
<ProtectedRoute>
<PageContainer title="Role Edit" description="this is Role Edit">
<Typography component="h1" variant="h1" mb={5}>Edit Role</Typography>
<Card sx={{ p: 3 }}>
   
 <Typography component="h1" variant="h5" mb={1}> Detail </Typography>
 <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'center',}}>

<EditRoleForm />

 </Box>
 </Card>
 </PageContainer>
</ProtectedRoute>
     ); 
};

export default EditRolePage;