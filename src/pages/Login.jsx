import React from "react";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://source.unsplash.com/1600x900/?night,sky')`,
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-6 rounded-t-2xl">
          <h2 className="text-2xl font-semibold">Sign in</h2>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <FacebookIcon className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
          <GitHubIcon className="text-gray-800 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
          <GoogleIcon className="text-red-500 cursor-pointer hover:scale-110 transition-transform" fontSize="large" />
        </div>

        {/* Divider */}
        <div className="px-8">
          <hr className="border-gray-200 my-6" />
        </div>

        {/* Form */}
        <form className="px-8 space-y-4 pb-6">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            size="small"
          />

          {/* Remember Me */}
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />

          {/* Sign In Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
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

        {/* Sign Up Link */}
        <div className="text-center pb-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
