import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupRequest, resetAuthState } from './authSlice';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupStatus, error: apiError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (signupStatus === 'succeeded') {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    return () => {
      dispatch(resetAuthState());
    };
  }, [signupStatus, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setFormError('Passwords do not match.'); return; }
    dispatch(signupRequest({ email, password }));
  };

  return (
    <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">Sign up</Typography>
            {signupStatus === 'succeeded' && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>Signup successful! Redirecting to login...</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {formError && <Alert severity="warning">{formError}</Alert>}
                {apiError && signupStatus === 'failed' && <Alert severity="error">{apiError}</Alert>}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={signupStatus === 'loading' || signupStatus === 'succeeded'}>
                    {signupStatus === 'loading' ? 'Signing Up...' : 'Sign Up'}
                </Button>
                <Button fullWidth onClick={() => navigate('/login')}>
                    Already have an account? Sign In
                </Button>
            </Box>
        </Box>
    </Container>
  );
};

export default Signup;