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

export default function Profile() {
  const router = useRouter();
  const { uid } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Button
        variant="contained"
        onClick={() => {
          // Change route to notifications!
          router.push("/");
        }}
        sx={{
          fontSize: "2rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <Bell />
      </Button>
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
        <Grid size={{ md: 6 }}>
          <Streaks uid={uid} />
        </Grid>
        <Grid size={{ md: 6 }}>
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
