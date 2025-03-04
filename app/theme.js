"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6750A4",
      light: "#EADDFF",
      medium: "#D0BCFF",
      emphasis: "#9C85D1",
      dark: "#4F378B",
      contrastText: "#FFFFFF",
    },
    light: {
      main: "#FEF7FF",
    },
  },
});

export default theme;
