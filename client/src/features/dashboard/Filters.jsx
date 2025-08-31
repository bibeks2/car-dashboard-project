import React, { useTransition, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, styled } from '@mui/material';
import { setFilter, applyFilters } from './carsSlice';
import { addBookmark } from '../bookmarks/bookmarksSlice';

const FilterControl = styled(FormControl)({
  minWidth: 120,
  width: '100%',
});

const Filters = () => {
  const dispatch = useDispatch();
  const { filters, allData } = useSelector((state) => state.cars);
  const [isPending, startTransition] = useTransition();

  const { uniqueOrigins, uniqueCylinders, originCounts } = useMemo(() => {
    const origins = new Set();
    const cylinders = new Set();
    const counts = {};

    allData?.forEach(car => {
      if (car.origin) {
        origins.add(car.origin);
        counts[car.origin] = (counts[car.origin] || 0) + 1;
      }
      if (car.cylinders) {
        cylinders.add(car.cylinders);
      }
    });
    return { 
      uniqueOrigins: Array.from(origins).sort(),
      uniqueCylinders: Array.from(cylinders).sort((a,b) => a - b),
      originCounts: counts
    };
  }, [allData]);
    useEffect(() => {
      const handler = setTimeout(() => {
        dispatch(applyFilters());
      }, 500);
      return () => {
         clearTimeout(handler);
      };
    }, [filters, dispatch]);
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilter({ name, value }));
  };
  
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    startTransition(() => {
        dispatch(setFilter({ name, value }));
    });
  };

  const handleApplyClick = () => {
    dispatch(applyFilters());
  };

  const handleAddBookmark = () => {
    dispatch(addBookmark({ query: filters }));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
            <TextField
                name="q"
                label="Search (live) by Car Name..."
                variant="outlined"
                value={filters.q}
                onChange={handleSearchChange}
                fullWidth
                sx={{ opacity: isPending ? 0.6 : 1 }}
            />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <FilterControl variant="outlined">
            <InputLabel>Cylinders</InputLabel>
            <Select name="cylinders" value={filters.cylinders} onChange={handleFilterChange} label="Cylinders">
              <MenuItem value=""><em>Any</em></MenuItem>
              {uniqueCylinders.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FilterControl>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
           <FilterControl variant="outlined">
            <InputLabel>Origin</InputLabel>
            <Select name="origin" value={filters.origin} onChange={handleFilterChange} label="Origin">
              <MenuItem value=""><em>Any</em></MenuItem>
              {uniqueOrigins.map(o => (
                <MenuItem key={o} value={o}>
                  {`${o} (${originCounts[o] || 0})`}
                </MenuItem>
              ))}
            </Select>
          </FilterControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
            <Button variant="contained" color="primary" onClick={handleApplyClick} fullWidth>Apply</Button>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
            <Button variant="outlined" color="secondary" onClick={handleAddBookmark} fullWidth>Add Bookmark</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;