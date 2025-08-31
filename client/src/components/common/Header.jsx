import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '../../api';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed, proceeding with client-side cleanup.", error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Car Dashboard
        </Typography>
        <Box>
            <Button color="inherit" component={RouterLink} to="/about">About</Button>
            {isAuthenticated ? (
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
                <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
