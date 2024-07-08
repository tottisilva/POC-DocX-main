'use client';

import React, { useState } from 'react';
import { styled, Container, Box } from '@mui/material';
import Header from '../../app/(DashboardLayout)/layout/header/Header';
import Sidebar from '../../app/(DashboardLayout)/layout/sidebar/Sidebar';
import { SessionProvider } from 'next-auth/react';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <MainWrapper className="mainwrapper">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        {/* Main Wrapper */}
        <PageWrapper className="page-wrapper">
          {/* Header */}
          <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
          {/* PageContent */}
          <Container
            sx={{
              paddingTop: '20px',
              maxWidth: '1500px',
            }}
          >
            {children}
          </Container>
        </PageWrapper>
      </MainWrapper>
    </SessionProvider>
  );
}
