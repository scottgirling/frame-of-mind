"use client";
import { Box } from "@mui/material";

export default function CanvasLayout({ children }) {
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
