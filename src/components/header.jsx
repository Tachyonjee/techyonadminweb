import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Dashboard, Person, LockOpen, VpnKey } from '@mui/icons-material';

const navLinks = [
  { label: 'Dashboard', icon: <Dashboard fontSize="small" />, path: '/dashboard' },
  { label: 'Profile', icon: <Person fontSize="small" />, path: '/profile' },
  { label: 'Sign Up', icon: <LockOpen fontSize="small" />, path: '/signup' },
  { label: 'Sign In', icon: <VpnKey fontSize="small" />, path: '/signin' },
];

const Header = () => {
  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        margin: 'auto',
        width:"90%",
        px: 2,
        top:10
      }}
    >
      <Toolbar disableGutters className="flex justify-between w-full">
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: '#1e293b', fontWeight: 'bold', pl: 2 }}
        >
          Techyon
        </Typography>

        {/* Navigation Links */}
        <Box className="flex gap-4 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2 py-1 rounded-md ${
                  isActive ? 'bg-gray-200' : ''
                }`
              }
              style={{ textDecoration: 'none', color: '#334155', fontWeight: 500 }}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
