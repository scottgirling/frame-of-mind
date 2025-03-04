import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthContextProvider } from "./contexts/LoggedInUser";

export const metadata = {
  title: "Frame of Mind",
  description: "Express your creativity a little bit every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <AuthContextProvider>
          <main className="mx-auto">
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
