import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import { Box, Container } from '@mui/material';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container 
        component="main" 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column' 
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;