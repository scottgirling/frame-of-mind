import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthContextProvider } from "./contexts/LoggedInUser";
import { Box } from "@mui/material";

export const metadata = {
  title: "Frame of Mind",
  description: "Express your creativity a little bit every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  bgcolor: "light.main",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                {children}
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
