import { Box, Typography } from "@mui/material";
import { FireSimple } from "@phosphor-icons/react/dist/ssr";

export default function StreakFire({ weekStreak }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "max-content",
      }}
    >
      <FireSimple style={{ fontSize: "10rem" }} />
      <Typography sx={{ position: "absolute", fontSize: "2rem", mt: 3 }}>
        {weekStreak}
      </Typography>
    </Box>
  );
}
