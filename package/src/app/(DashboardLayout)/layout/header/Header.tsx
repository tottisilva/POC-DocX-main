import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Grid } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import NavBar from './UserInfo';
import { useSession } from 'next-auth/react';

interface ItemType {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<ItemType> = ({ toggleMobileSidebar }) => {
  const { data: session } = useSession();

  return (
    <AppBar position="sticky" color="default">
      <Toolbar>
      <Grid container display="flex" alignItems="center">
          <Grid xs={6}>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {session ? (
          <IconButton
            size="large"
            aria-label="show 11 new notifications"
            color="inherit"
          >
            <Badge variant="dot" color="primary">
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
        ) : null}
      </Grid>
      <Grid xs={6} display="flex" justifyContent="flex-end">
        <Stack spacing={1} direction="row" alignItems="center">
          <NavBar />
        </Stack>
      </Grid>
      </Grid> 
      </Toolbar>
    </AppBar>
  );
};

export default Header;
