import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DayStreak from "./DayStreak";
import StreakFire from "./StreakFire";
import WeekStreak from "./WeekStreak";
import getData from "@/app/firestore/getData";

export default function Streaks({ user, rotation }) {
  const [dayStreak, setDayStreak] = useState(0);
  const [weekStreak, setWeekStreak] = useState(0);

  useEffect(() => {
    async function getStreaks() {
      const userInfo = (await getData("users", user.uid)).result.data();
      const dayStreak = userInfo.dayStreak;
      const weekStreak = userInfo.weekStreak;
      setDayStreak(dayStreak);
      setWeekStreak(weekStreak);
    }
    getStreaks();
  }, [dayStreak, weekStreak]);

  return (
    <Box
      sx={{
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        rotate: rotation,
      }}
    >
      <DayStreak weekStreak={weekStreak} dayStreak={dayStreak} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <StreakFire weekStreak={weekStreak} rotation={-5} />
        <WeekStreak dayStreak={dayStreak} weekStreak={weekStreak} />
      </Box>
    </Box>
  );
}
