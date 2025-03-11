import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import DayStreak from "./DayStreak";
import StreakFire from "./StreakFire";
import WeekStreak from "./WeekStreak";

export default function Streaks({ userRef }) {
  const [dayStreak, setDayStreak] = useState(0);
  const [weekStreak, setWeekStreak] = useState(0);

  useEffect(() => {
    async function getStreaks() {
      const userSnapshot = await getDoc(userRef);
      const dayStreak = userSnapshot.data().dayStreak;
      const weekStreak = userSnapshot.data().weekStreak;
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
