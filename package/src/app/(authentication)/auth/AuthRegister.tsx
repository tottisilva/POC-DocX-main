import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Stack } from '@mui/system';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';

interface RegisterType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: RegisterType) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };


  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await fetch('/api/users/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password}),
      });

      router.push('/login'); // Assuming you have a route for listing users
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box>
      <form onSubmit={handleRegister}>
            <Stack mb={3}>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
                Name
            </Typography>
            <CustomTextField id="name" variant="outlined" fullWidth value={name} onChange={handleNameChange} />

            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
                Email Address
            </Typography>
            <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={handleEmailChange} />

            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
                Password
            </Typography>
            <CustomTextField
                id="password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
            />
            </Stack>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleRegister}>
            Sign Up
            </Button>
        </form>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
