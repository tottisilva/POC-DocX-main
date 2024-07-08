import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

const LoadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const LoadingComponent = () => {
  return (
    <LoadingWrapper>
      <CircularProgress size={60}/>
    </LoadingWrapper>
  );
};

export default LoadingComponent;
