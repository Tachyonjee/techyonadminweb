import React from "react";
import { Skeleton, Box } from "@mui/material";

const Loader = ({ loading, type = "card" }) => {
  if (!loading) return null;

  return (
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
      ) : (
        <Skeleton variant="circular" width={40} height={40} />
      )}
    </Box>
  );
};

export default Loader;
