import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
} from '@mui/material';

export default function Signup() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'subject' && formData.role !== 'Teacher') return; // Skip subject for non-teachers
      if (!value) tempErrors[key] = 'This field is required';
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Submitting form: ', formData);
      // TODO: API call here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 ">
      <div className="relative bg-white rounded-xl shadow-lg p-6 pt-16 w-full max-w-md mt-20">
        {/* Floating Header Card */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-4 rounded-xl shadow-lg w-72 text-center">
          <Typography variant="h6" className="font-bold">
            Join us today
          </Typography>
          <Typography variant="body2">
            Enter your email and password to register
          </Typography>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={!!errors.name}
            helperText={errors.name}
          />

          {/* Username */}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={!!errors.username}
            helperText={errors.username}
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Mobile Number */}
          <TextField
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="standard"
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Role */}
          <FormControl fullWidth variant="standard" error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
            <FormHelperText>{errors.role}</FormHelperText>
          </FormControl>

          {/* Subject for Teacher */}
          {formData.role === 'Teacher' && (
            <FormControl fullWidth variant="standard" error={!!errors.subject}>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
              </Select>
              <FormHelperText>{errors.subject}</FormHelperText>
            </FormControl>
          )}

          {/* Class */}
          <FormControl fullWidth variant="standard" error={!!errors.class}>
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange}
            >
              <MenuItem value="Class 11">Class 11</MenuItem>
              <MenuItem value="Class 12">Class 12</MenuItem>
            </Select>
            <FormHelperText>{errors.class}</FormHelperText>
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg shadow-md"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
