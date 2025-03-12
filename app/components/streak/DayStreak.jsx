import { Avatar, Box, Typography } from "@mui/material";
import { Check } from "@phosphor-icons/react";

export default function DayStreak({ dayStreak }) {
  const daysArray = ["M", "T", "W", "Th", "F", "Sa", "Su"];

  return (
    <>
      <Typography sx={{ textAlign: "center" }}>Your daily streak:</Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
        }}
      >
        {daysArray.map((day, i) => {
          return (
            <Avatar key={day} sx={i < dayStreak ? { bgcolor: "green" } : null}>
              <Check />
            </Avatar>
          );
        })}
      </Box>
    </>
  );
}
