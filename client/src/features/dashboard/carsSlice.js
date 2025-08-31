import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allData: [],
  filteredData: [],
  status: 'idle',
  error: null,
  filters: { /* ... same initial filters ... */ },
  sortConfig: { key: 'name', direction: 'asc' },
  stats: { origins: [], cylinders: [] },
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    fetchCarsRequest: (state) => {
      state.status = 'loading';
    },
    fetchCarsSuccess: (state, action) => {
      const { data, isFiltered } = action.payload;
      state.status = 'succeeded';
      state.filteredData = data;
      
      if (!isFiltered) {
        state.allData = data;
        const originSet = new Set();
        const cylinderSet = new Set();
        data.forEach(car => {
            originSet.add(car.origin);
            cylinderSet.add(car.cylinders);
        });
        state.stats.origins = Array.from(originSet).sort();
        state.stats.cylinders = Array.from(cylinderSet).sort((a,b) => a - b);
      }
    },
    fetchCarsFailure: (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    },
    setFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters[name] = value;
    },
    applyFilters: () => {
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    applyBookmark: (state, action) => {
      state.filters = action.payload;
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
  setFilter,
  applyFilters,
  resetFilters,
  applyBookmark,
  setSortConfig,
} = carsSlice.actions;

export default carsSlice.reducer;