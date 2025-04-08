import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  Person,
  LockOpen,
  VpnKey,
  Logout as LogoutIcon,
  Quiz as QuizIcon,
  KeyboardArrowDown
} from '@mui/icons-material';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQuestionMenuClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

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

  const isQuestionRoute = location.pathname === '/questions' || location.pathname === '/questions/create';
  const isDashboardRoute = location.pathname === getDashboardPath();

  return (
    <AppBar 
      position="sticky" 
      elevation={3}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        margin: '10px auto',
        width: '90%',
        px: 2,
      }}
    >
      <Toolbar>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none', 
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src="/assets/images/logo.png" 
            alt="Logo" 
            style={{ 
              height: '50px',
              width: '50px',
              objectFit: 'contain',
              marginRight: '10px'
            }} 
          />
          <Typography variant="h6" component="div">
            Techyon Admin
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user ? (
            <>
              <Button
                component={NavLink}
                to={getDashboardPath()}
                startIcon={<Dashboard />}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: isDashboardRoute ? theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                Dashboard
              </Button>
              {role === 'teacher' && (
                <>
                  <Button
                    onClick={handleMenuOpen}
                    startIcon={<QuizIcon />}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      color: theme.palette.text.primary,
                      backgroundColor: isQuestionRoute ? theme.palette.action.selected : 'transparent',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    Manage Questions
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleQuestionMenuClick('/questions')}>
                      Question List
                    </MenuItem>
                    <MenuItem onClick={() => handleQuestionMenuClick('/questions/create')}>
                      Create Question
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Button
                component={NavLink}
                to="/profile"
                startIcon={<Person />}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: location.pathname === '/profile' ? theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                Profile
              </Button>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/signin"
                startIcon={<LockOpen />}
                sx={{ color: theme.palette.text.primary }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signUp"
                startIcon={<VpnKey />}
                sx={{ color: theme.palette.text.primary }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
