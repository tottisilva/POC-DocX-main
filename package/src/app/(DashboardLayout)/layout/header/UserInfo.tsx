import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import Profile from './Profile';

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <Profile />
      ) : (
        <Button variant="contained" disableElevation color="primary" type="submit" href="/login">
          Sign in
        </Button>
      )}
    </>
  );
}
