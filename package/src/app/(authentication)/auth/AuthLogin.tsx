import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { LogInForm } from '../login/loginForm';

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box>
      <LogInForm/>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
