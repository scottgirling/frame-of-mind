import { Box, Typography } from "@mui/material";

export default function WeekStreak({ weekStreak, dayStreak }) {
  return (
    <Box
      sx={{
        bgcolor: "primary.light",
        borderRadius: 3,
        p: 5,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        width: "70%",
      }}
    >
      <Typography sx={{}}>Your week streak: {weekStreak}</Typography>
      <Typography>
        {weekStreak > 1 ? "You’re on fire! Keep it up!" : "Welcome back!"}
        {dayStreak > 1
          ? " Draw something every day to maintain your streak!"
          : " Draw something today to start your streak!"}
      </Typography>
    </Box>
  );
}
