import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About This Application
        </Typography>
        <Typography variant="body1" paragraph>
          This application is a Single Page Application (SPA) built with React, demonstrating a range of modern web development features.
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Core Technologies Used:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
            <li><Typography variant="body1">React 18+</Typography></li>
            <li><Typography variant="body1">React Router for client-side routing</Typography></li>
            <li><Typography variant="body1">Redux Toolkit & Redux Saga for state management</Typography></li>
            <li><Typography variant="body1">MUI (Material-UI) for the component library</Typography></li>
            <li><Typography variant="body1">Chart.js for data visualization</Typography></li>
            <li><Typography variant="body1">Node.js/Express for the backend API</Typography></li>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;