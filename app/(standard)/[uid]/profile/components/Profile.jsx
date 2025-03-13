"use client";

import {
  Box,
  Button,
  CircularProgress,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import Streaks from "@/app/components/streak/Streaks";
import PaperButton from "@/app/components/PaperButton";
import { PaintBrush } from "@phosphor-icons/react/dist/ssr";
import PaperBox from "@/app/components/PaperBox";
import { Bell, Palette } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getUserInfo from "../utils/getUserInfo";
import Avatar from "@/app/components/Avatar";
import StreakFire from "@/app/components/streak/StreakFire";
import getData from "@/app/firestore/getData";

export default function Profile() {
  const router = useRouter();
  const { uid } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dayStreak, setDayStreak] = useState(0);
  const [weekStreak, setWeekStreak] = useState(0);

  useEffect(() => {
    if (!uid) return;

    async function getStreaks() {
      try {
        const userInfo = (await getData("users", uid)).result.data();
        setDayStreak(userInfo.dayStreak || 0);
        setWeekStreak(userInfo.weekStreak || 0);
      } catch (error) {
        console.error("Failed to fetch streaks:", error);
      }
    }

    getStreaks();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    async function fetchUser() {
      setLoading(true);
      try {
        const userInfo = await getUserInfo(uid);
        setUserInfo(userInfo);
        setError(null);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [uid]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>{error}</Typography>;
  if (!uid) return <Typography>No user data found.</Typography>;

  return (
    <Box sx={{ position: "relative" }}>
      {/* Edit button currently doesnt do anything */}
      <Button
        variant="outlined"
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
        }}
      >
        Edit profile
      </Button>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar
          avatarUrl={userInfo.avatarUrl}
          displayName={userInfo.displayName}
          sx={{
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
            width: 200,
            height: 200,
            mb: 2,
          }}
        />
        <Typography
          variant="h1"
          sx={{ fontSize: 30, textAlign: "left", mb: 1 }}
        >
          {userInfo.displayName}
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontSize: 20, textAlign: "left", mb: 5 }}
        >
          Member since {userInfo.createdAt}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid>
          <StreakFire dayStreak={dayStreak} weekStreak={weekStreak} />
        </Grid>
        <Grid size={10}>
          <PaperBox
            colour="primary"
            variant="light"
            sx={{ p: 5, height: "100%" }}
            margin={{ height: "100%" }}
            rotation={-1}
          >
            <Typography>{userInfo.userBio}</Typography>
          </PaperBox>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <PaperButton
          href={"/create"}
          variant="green"
          margin={{ mx: 1, mb: 5 }}
          sx={{ fontSize: "2rem", pr: 3, pl: 2, pt: 0 }}
          rotation={2}
        >
          <PaintBrush style={{ marginRight: ".5rem", marginTop: ".5rem" }} />{" "}
          Create
        </PaperButton>

        <PaperButton
          href={"/community"}
          variant="primary"
          margin={{ mx: 1, mb: 5 }}
          sx={{ fontSize: "2rem", pr: 3, pl: 2, pt: 0 }}
          rotation={-1}
        >
          <Palette style={{ marginRight: ".5rem", marginTop: ".5rem" }} />{" "}
          Community
        </PaperButton>
      </Box>
    </Box>
  );
}
