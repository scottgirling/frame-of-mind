import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import WeekStreak from "./WeekStreak";
import StreakFire from "./StreakFire";
import DayStreak from "./DayStreak";
import getData from "@/app/firestore/getData";

export default function Streaks({ user, rotation }) {
  const [dayStreak, setDayStreak] = useState(0);
  const [weekStreak, setWeekStreak] = useState(0);

  useEffect(() => {
    if (!user.uid) return;

    async function getStreaks() {
      try {
        const userInfo = (await getData("users", user.uid)).result.data();
        setDayStreak(userInfo.dayStreak || 0);
        setWeekStreak(userInfo.weekStreak || 0);
      } catch (error) {
        console.error("Failed to fetch streaks:", error);
      }
    }

    getStreaks();
  }, [user.uid]);

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
