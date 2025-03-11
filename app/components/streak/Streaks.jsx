import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import DayStreak from "./DayStreak";
import StreakFire from "./StreakFire";
import WeekStreak from "./WeekStreak";
import getData from "@/app/firestore/getData";

export default function Streaks({ user }) {
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
    <Box>
      <DayStreak dayStreak={dayStreak} />
      <Box sx={{ display: "flex" }}>
        <StreakFire weekStreak={weekStreak} />
        <WeekStreak dayStreak={dayStreak} weekStreak={weekStreak} />
      </Box>
    </Box>
  );
}
