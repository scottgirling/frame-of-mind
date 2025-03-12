import { Box, Typography } from "@mui/material";
import PaperBox from "../PaperBox";

export default function WeekStreak({ weekStreak, dayStreak }) {
  return (
    <PaperBox
      colour="primary"
      variant="light"
      rotation={2}
      sx={{ borderRadius: 3, p: 5 }}
    >
      <Typography>
        {weekStreak > 1 ? <strong>You’re on fire! Keep it up!</strong> : null}
      </Typography>
      <Typography>
        {dayStreak > 1
          ? " Draw something every day to maintain your streak!"
          : " Draw something today to start your streak!"}
      </Typography>
    </PaperBox>
  );
}
