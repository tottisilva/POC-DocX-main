"use client";

import { Box, Typography, Button, Stack } from '@mui/material';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useRouter } from 'next/navigation';
import { signInWithCredentials } from './serverAuth';
export function LogInForm() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value
    };

    try {
      // Attempt to sign in with credentials
      await signInWithCredentials(formData);

      // If no error is thrown, login is successful
      // Redirect to the dashboard page
      router.push('/');
    } catch (error) {
      // Handle errors here
      console.error('An error occurred during login:', error);
      // For example, display an error message to the user
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Stack mb={3}>
        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
          Email Address
        </Typography>
        <CustomTextField id="email" variant="outlined" fullWidth />

        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
          Password
        </Typography>
        <CustomTextField
          id="password"
          type="password"
          variant="outlined"
          fullWidth
        />
      </Stack>
      <Button color="primary" variant="contained" size="large" fullWidth type="submit">
        Sign In
      </Button>
    </form>
  );
}
