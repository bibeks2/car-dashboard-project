import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, ListItem, ListItemText, Paper, Popover, styled, keyframes } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { applyBookmark, applyFilters } from '../dashboard/carsSlice';

const rotateBorderAntiClockwise = keyframes`
  0% { border-image-source: linear-gradient(to top, #3f51b5, #9c27b0, #f44336, #ff9800); }
  25% { border-image-source: linear-gradient(to left, #3f51b5, #9c27b0, #f44336, #ff9800); }
  50% { border-image-source: linear-gradient(to bottom, #3f51b5, #9c27b0, #f44336, #ff9800); }
  75% { border-image-source: linear-gradient(to right, #3f51b5, #9c27b0, #f44336, #ff9800); }
  100% { border-image-source: linear-gradient(to top, #3f51b5, #9c27b0, #f44336, #ff9800); }
`;

const BookmarksContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

const BookmarkItem = styled(ListItem)(({ theme }) => ({
  border: '3px solid transparent',
  borderBottom: `3px solid ${theme.palette.divider}`,
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.action.hover,
    borderImageSlice: 2,
    animation: `${rotateBorderAntiClockwise} 1s linear infinite`,
  }
}));

const BookmarksPane = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.items);

  const [hoveredBookmark, setHoveredBookmark] = useState(null);
  const [popoverCoords, setPopoverCoords] = useState(null);

  const handlePopoverOpen = (event, bookmark) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverCoords({
      top: rect.top + 5,
      left: rect.left + 100,
    });
    setHoveredBookmark(bookmark);
  };

  const handlePopoverClose = () => {
    setPopoverCoords(null);
    setHoveredBookmark(null);
  };

  const handleBookmarkClick = (bookmark) => {
    dispatch(applyBookmark(bookmark.query));
    dispatch(applyFilters());
  };

  const open = Boolean(popoverCoords);

  const Row = ({ index, style }) => {
    const bookmark = bookmarks[index];
    const querySummary = Object.entries(bookmark.query)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return (
      <BookmarkItem
        style={style}
        key={bookmark.id}
        onMouseEnter={(e) => handlePopoverOpen(e, bookmark)}
        onMouseLeave={handlePopoverClose}
        onClick={() => handleBookmarkClick(bookmark)}
      >
        <ListItemText
          primary={querySummary || "All Cars"}
          secondary={new Date(bookmark.id).toLocaleString()}
        />
      </BookmarkItem>
    );
  };

  return (
    <>
      <BookmarksContainer elevation={0}>
        <Typography variant="h6" gutterBottom sx={{ p: 1 }}>
          Bookmarked Searches
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          {bookmarks.length > 0 ? (
            <FixedSizeList
              height={window.innerHeight - 200}
              width="100%"
              itemSize={70}
              itemCount={bookmarks.length}
            >
              {Row}
            </FixedSizeList>
          ) : (
            <Typography sx={{ p: 2 }}>No bookmarks saved.</Typography>
          )}
        </Box>
      </BookmarksContainer>

      <Popover
        id="mouse-over-popover"
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={popoverCoords}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{
          pointerEvents: 'none', 
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 350, border: '1px solid #ddd' }}>
          <Typography variant="subtitle2" gutterBottom>Saved Query Details:</Typography>
          {hoveredBookmark && Object.entries(hoveredBookmark.query).map(([key, value]) =>
            value ? <Typography key={key} variant="body2">{`${key}: ${value}`}</Typography> : null
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default BookmarksPane;