import TopBar from "./components/TopBar";
import { Box, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Box
        component={"main"}
        sx={{ m: "auto", pb: 10, color: "primary.dark", textAlign: "center" }}
      >
        <Typography variant="h1" sx={{ fontSize: "4rem", fontWeight: "light" }}>
          404
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "2rem", fontWeight: "light" }}
        >
          Not Found
        </Typography>
      </Box>
    </>
  );
}
