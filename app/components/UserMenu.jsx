"use client";
import Avatar from "../components/Avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import getData from "../firestore/getData";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Menu, MenuItem } from "@mui/material";

export default function UserMenu({ sx }) {
  const [authUser] = useAuthState(auth);
  const [displayName, setDisplayName] = useState(undefined);
  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
    <Box sx={{ ...sx }}>
      <Avatar
        displayName={displayName}
        avatarUrl={avatarUrl}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            signOut(auth);
            setAvatarUrl(null);
            setDisplayName("");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
