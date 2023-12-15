import React, { useState,useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import foxhub from '../assets/foxhub.png';
import LoadingButton from '@mui/lab/LoadingButton';
import Cookies from 'js-cookie';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const userData = {
        userID: userId,
        password: password,
      };
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      };
  
      const response = await fetch('https://lyf-music-dashboard.onrender.com/api/login', requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(
          response.status === 401 && errorData.message === 'Not yet registered. Please contact support.'
            ? 'Not yet registered. Please contact support.'
            : 'Password did not match.'
        );
      } else {
        const data = await response.json();
        const token = data.token;
        setUserId('');
        setPassword('');
        localStorage.setItem('token', token);
        window.location.href = '/';
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };
  
  
 
  
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ background: 'white', padding: 2 }}
      >
        <img src={foxhub} alt="Company Logo" style={{ width: '200px', marginBottom: '20px' }} />
        <Typography variant="h6" gutterBottom>
          Client Login
        </Typography>
        <Box width="100%" p={2}>
          <TextField
            label="User ID"
            fullWidth
            variant="outlined"
            size="small"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            sx={{ borderRadius: 0 }}
          />
        </Box>
        <Box width="100%" p={2}>
          <TextField
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ borderRadius: 0 }}
          />
        </Box>
        <Box width="100%" p={2}>
          <LoadingButton
            variant="contained"
            color="primary"
            fullWidth
            disableElevation
            loading={loading}
            onClick={handleLogin}
          >
            Login
          </LoadingButton>
        </Box>
        <Box width="100%" p={2} textAlign="center">
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Typography variant="body2">
            If you have forgotten your user ID or password, please contact support at{' '}
            <Typography
              variant="inherit"
              component="a"
              href="mailto:contact@lyf-music.com"
              underline="none"
              color="inherit"
            >
              contact@lyf-music.com
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
