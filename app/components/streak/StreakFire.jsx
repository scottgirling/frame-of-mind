import { useTheme } from "@emotion/react";
import { Badge, Box, Chip, Typography } from "@mui/material";
import { FireSimple } from "@phosphor-icons/react/dist/ssr";

export default function StreakFire({ weekStreak, rotation }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "max-content",
          color: theme.palette.secondary.main,
          transform: "rotate(" + rotation * -1 + "deg)",
        }}
      >
        <FireSimple
          style={{
            fontSize: "10rem",
          }}
        />
        <Typography
          sx={{
            position: "absolute",
            fontSize: "2rem",
            mt: 3,
            transform: "rotate(" + rotation * 3 + "deg)",
          }}
        >
          {weekStreak}
        </Typography>
      </Box>
      <Chip
        color="secondary"
        label="Week Streak"
        sx={{
          transform: "rotate(" + rotation * 0.3 + "deg)",
        }}
      />
    </Box>
  );
}
