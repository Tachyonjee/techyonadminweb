import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import {
  LockOpen as LockOpenIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, role, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Redirect if user is already logged in
    if (role) {
      console.log('Current role for redirection:', role);
      console.log('Current user state:', user);
      switch (role.toLowerCase()) {
        case 'admin':
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          console.log('Redirecting to questions page');
          navigate('/questions');
          break;
        case 'student':
          console.log('Redirecting to student dashboard');
          navigate('/student/dashboard');
          break;
        default:
          console.warn('Unknown role:', role);
          break;
      }
    }
  }, [role, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) tempErrors[key] = 'This field is required';
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log('Attempting login with:', formData);
        const result = await dispatch(login(formData)).unwrap();
        console.log('Login result:', result);
        if (result) {
          // Navigation is handled by the useEffect above
        }
      } catch (error) {
        console.error('Login error:', error);
        // Error is handled by the auth slice
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '16px',
              position: 'absolute',
              top: '-32px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              boxShadow: 3,
              width: '80%',
              maxWidth: '400px',
            }}
          >
            <Typography variant="h5" component="h1">
              Welcome Back
            </Typography>
            <Typography variant="body2">
              Sign in to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: <LockOpenIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  component="a"
                  href="/signup"
                  variant="text"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
