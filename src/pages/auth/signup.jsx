import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import { getRoles, getClassList, getSubjects } from '../../apis/questionApi';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, role } = useSelector((state) => state.auth);
  const [roles, setRoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    mobileNumber: '',
    email: '',
    role: '',
    subject: '',
    class: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        console.log("roles",rolesData);
        if (Array.isArray(rolesData?.data)) {
          setRoles(rolesData?.data);
        } else {
          console.error('Roles data is not an array:', rolesData);
          setRoles([]);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    // Fetch classes from API
    const fetchClasses = async () => {
      try {
        const classesData = await getClassList();
        if (Array.isArray(classesData)) {
          setClasses(classesData);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    // Fetch subjects when class is selected and role is teacher
    const fetchSubjects = async () => {
      if (formData.class && getRoleName(formData.role) === 'teacher') {
        try {
          const subjectsData = await getSubjects(formData.class);
          if (Array.isArray(subjectsData)) {
            setSubjects(subjectsData);
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [formData.class, formData.role]);

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Redirect if user is already logged in
    if (role) {
      if (role === 'admin') navigate('/admin/question-setup');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
    }
  }, [role, navigate]);

  const getRoleName = (roleId) => {
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If role is changing, clear class and subject
    if (name === 'role') {
      setFormData({
        ...formData,
        role: value,
        class: '',
        subject: ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      // Skip validation for subject if role is not teacher
      if (key === 'subject' && getRoleName(formData.role) !== 'teacher') return;
      // Skip validation for class if role is admin
      if (key === 'class' && getRoleName(formData.role) === 'admin') return;
      if (!value) tempErrors[key] = 'This field is required';
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Prepare the data to send to API
        const registrationData = {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          roleId: formData.role,
          classId: getRoleName(formData.role) === 'admin' ? null : formData.class,
          subjectId: getRoleName(formData.role) === 'teacher' ? formData.subject : null
        };

        const result = await dispatch(register(registrationData)).unwrap();
        if (result) {
          // Navigation is handled by the useEffect above
        }
      } catch (error) {
        // Error is handled by the auth slice
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
            backgroundColor: 'white',
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
              Create Account
            </Typography>
            <Typography variant="body2">
              Sign up to get started
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              autoComplete="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <FormControl fullWidth margin="normal" required error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading roles...</MenuItem>
                )}
              </Select>
              {errors.role && (
                <Typography color="error" variant="caption">
                  {errors.role}
                </Typography>
              )}
            </FormControl>
            {getRoleName(formData.role) !== 'admin' && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  label="Class"
                  error={!!errors.class}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.class && (
                  <Typography color="error" variant="caption">
                    {errors.class}
                  </Typography>
                )}
              </FormControl>
            )}
            {getRoleName(formData.role) === 'teacher' && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                  labelId="subject-label"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label="Subject"
                  error={!!errors.subject}
                  disabled={!formData.class}
                >
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <MenuItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {formData.class ? 'No subjects available' : 'Select a class first'}
                    </MenuItem>
                  )}
                </Select>
                {errors.subject && (
                  <Typography color="error" variant="caption">
                    {errors.subject}
                  </Typography>
                )}
              </FormControl>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
