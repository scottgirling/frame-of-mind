import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./global.css";
import { Box, CssBaseline } from "@mui/material";

export const metadata = {
  title: "Frame of Mind",
  description: "Express your creativity a little bit every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                bgcolor: "primary.light",
                color: "primary.dark",
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundImage: "url(/assets/pattern.png)",
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
