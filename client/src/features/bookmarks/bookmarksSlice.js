import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const user = sessionStorage.getItem('token');
    if (user) {
        const userEmail = JSON.parse(atob(user.split('.')[1])).email;
        const savedBookmarks = localStorage.getItem(`bookmarks_${userEmail}`);
        return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    }
  } catch (e) {
    console.error("Could not load bookmarks", e);
  }
  return [];
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: getInitialState(),
  },
  reducers: {
    addBookmark: (state, action) => {
      const newBookmark = {
        ...action.payload,
        id: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
      };
      state.items.unshift(newBookmark);
      try {
        const user = sessionStorage.getItem('token');
        if (user) {
            const userEmail = JSON.parse(atob(user.split('.')[1])).email;
            localStorage.setItem(`bookmarks_${userEmail}`, JSON.stringify(state.items));
        }
      } catch (e) {
        console.error("Could not save bookmarks", e);
      }
    },
    clearBookmarks: (state) => {
      state.items = [];
    },
    loadBookmarks: (state) => {
      state.items = getInitialState();
    }
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', (state) => {
        state.items = [];
    });
  }
});

export const { addBookmark, clearBookmarks, loadBookmarks } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;