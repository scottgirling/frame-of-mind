"use client";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import NotLoggedIn from "@/app/components/authentication/NotLoggedIn";
import { useEffect } from "react";

export default function CanvasLayout({ children }) {
  const [authUser, loading] = useAuthState(auth);
  useEffect(() => {
    console.log(loading);
  }, []);
  if (loading) return <CircularProgress />;
  if (authUser) {
    return (
      <Box
        sx={{
          height: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NotLoggedIn />
    </Box>
  );
}
