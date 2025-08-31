import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper } from '@mui/material';
import Filters from './Filters';
import CarsTable from './CarsTable';
import CarsChart from './CarsChart';
import BookmarksPane from '../bookmarks/BookmarksPane';
import { fetchCarsRequest } from './carsSlice';
import { loadBookmarks } from '../bookmarks/bookmarksSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { allData } = useSelector(state => state.cars);

  useEffect(() => {
    if (isAuthenticated && allData.length === 0) {
      dispatch(fetchCarsRequest());
      dispatch(loadBookmarks());
    }
  }, [dispatch, isAuthenticated, allData.length]);

  return (
    <Box sx={{  p: 2 }}>
      <Grid container spacing={2} >
        
        <Grid sx={{width:'80%'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '80%', gap: 2 }}>
            
            <Paper sx={{width:'80%',p:2,mt:4}} elevation={3}>
              <Filters />
            </Paper>

            <Box sx={{ flexGrow: 1, minHeight: 0 ,mt:5}}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                
                <Grid sx={{width:'60%'}}>
                  <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <CarsTable />
                  </Paper>
                </Grid>
                
                <Grid sx={{width:'30%'}}>
                  <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <CarsChart />
                  </Paper>
                </Grid>

              </Grid>
            </Box>

          </Box>
        </Grid>
        
        <Grid >
            <BookmarksPane />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;