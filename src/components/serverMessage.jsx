import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const ServerMessage = ({ message, type, open, onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={onClose} 
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <MuiAlert 
        elevation={6} 
        variant="filled" 
        onClose={onClose} 
        severity={type} 
        className="rounded-lg shadow-md"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default ServerMessage;
