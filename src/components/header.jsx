import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { Dashboard, Person, LockOpen, VpnKey } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const navigate = useNavigate();

  // Check user login status from localStorage
  const user = JSON.parse(localStorage.getItem('user'))
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data
    navigate('/signin'); // Redirect to Signin
  };

  // Role-based dashboard routing
  const getDashboardPath = () => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        margin: 'auto',
        width: '90%',
        px: 2,
        top: 10,
      }}
    >
      <Toolbar disableGutters className="flex justify-between w-full">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center ">
          <img src="/assets/images/logo.png" alt="Logo" className="h-20 w-20 object-contain rounded-full" />
          <span className="sr-only">Techyon</span> {/* For screen readers */}
        </Link>

        {/* Navigation Links */}
        <Box className="flex gap-4 items-center">
          {user && (
            <NavLink
              to={getDashboardPath()}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2 py-1 rounded-md ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              style={{ textDecoration: 'none', color: '#334155', fontWeight: 500 }}
            >
              <Dashboard fontSize="small" />
              Dashboard
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `flex items-center gap-1 px-2 py-1 rounded-md ${
                    isActive ? 'bg-gray-200' : ''
                  }`
                }
                style={{ textDecoration: 'none', color: '#334155', fontWeight: 500 }}
              >
                <LockOpen fontSize="small" />
                Sign Up
              </NavLink>

              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `flex items-center gap-1 px-2 py-1 rounded-md ${
                    isActive ? 'bg-gray-200' : ''
                  }`
                }
                style={{ textDecoration: 'none', color: '#334155', fontWeight: 500 }}
              >
                <VpnKey fontSize="small" />
                Sign In
              </NavLink>
            </>
          )}

          {user && (
            <Button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 rounded-md"
              sx={{
                textTransform: 'none',
                color: '#334155',
                fontWeight: 500,
                padding: '6px 10px',
              }}
              startIcon={<LogoutIcon fontSize="small" />}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
