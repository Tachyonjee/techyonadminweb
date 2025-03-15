import React, { useState } from "react";
import {
  TextField, Button, Checkbox, FormControlLabel, Snackbar,
  Alert
} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { loginUser } from "../../apis/questionApi";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setSnackbar({
        open: true,
        message: "Please enter both Username and Password.",
        severity: "error",
      });
      return;
    }

    try {
      const result = await loginUser({ username, password });
      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
      let role = result?.role;
      if (role === 'admin') navigate('/admin/question-setup');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
      else navigate('/');

      // Optional: Save token or redirect
      // localStorage.setItem('token', result.token);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid credentials, please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-6 rounded-t-2xl">
          <h2 className="text-2xl font-semibold">Sign in</h2>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <FacebookIcon className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
          <GitHubIcon className="text-gray-800 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
          <GoogleIcon className="text-red-500 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
        </div>
        <div className="px-8">
          <hr className="border-gray-200 my-6" />
        </div>
        <form onSubmit={handleSubmit} className="px-8 space-y-4 pb-6">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            size="small"
          />
          {/* <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          /> */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{
              background: "linear-gradient(to right, #3b82f6, #1e40af)",
              color: "white",
              borderRadius: "8px",
              padding: "10px 0",
              fontWeight: "bold",
              '&:hover': {
                background: "linear-gradient(to right, #2563eb, #1e3a8a)",
              }
            }}
          >
            SIGN IN
          </Button>
        </form>
        <div className="text-center pb-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a className="text-blue-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
