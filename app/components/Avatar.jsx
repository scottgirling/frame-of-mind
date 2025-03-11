"use client";

import { auth } from "@/lib/firebase";
import { Avatar as MuiAvatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import getData from "../firestore/getData";

export default function Avatar({ sx }) {
  const [authUser] = useAuthState(auth);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (authUser) {
      async function fetchUserData() {
        const userInfo = (await getData("users", authUser.uid)).result.data();

        if (userInfo) {
          setAvatarUrl(userInfo.avatarUrl || null);
          setDisplayName(userInfo.displayName || "");
        }
      }
      fetchUserData();
    }
  }, [authUser]);

  return (
    <MuiAvatar
      sx={{
        ...sx,
        border: 2,
        borderColor: "primary.emphasis",
        bgcolor: "primary.light",
        color: "primary.main",
      }}
      src={avatarUrl || undefined}
    >
      {!avatarUrl && displayName?.charAt(0).toUpperCase()}
    </MuiAvatar>
  );
}
