"use client";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import NotLoggedIn from "@/app/components/authentication/NotLoggedIn";

export default function CanvasLayout({ children }) {
  const [authUser, loading] = useAuthState(auth);
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
