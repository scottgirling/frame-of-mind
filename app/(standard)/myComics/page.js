import { Box, Typography } from "@mui/material";
import ComicsList from "./components/ComicsList";

export default function myComicsPage() {
  return (
    <Box>
      <Box>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          My Comics!
        </Typography>
      </Box>
      <ComicsList />
    </Box>
  );
}
