import React from "react";
import { Backdrop, CircularProgress, Skeleton, Box } from "@mui/material";

const Loader = ({ loading, type = "circular" }) => {
  if (!loading) return null;

  return (
    <>
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" size={80}/>
      </Backdrop>
      <Box sx={{ width: "100%", marginTop: 2 }}>
        {type === "card" ? (
          <>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, marginBottom: 2 }} />
            <Skeleton variant="text" height={30} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
          </>
        ) : type === "list" ? (
          <>
            {[...Array(1)].map((_, index) => (
              <Skeleton key={index} variant="text" height={100} sx={{ marginBottom: 1 }} />
            ))}
          </>
        ) : null}
      </Box>
    </>
  );
};

export default Loader;
