"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Bell, Notification } from "@phosphor-icons/react";

export default function TopBar({ components }) {
  const router = useRouter();
  const [authUser] = useAuthState(auth);

  const handleNotificationsClick = () => {
    if (authUser) {
      router.push(`/${authUser.uid}/notifications/`);
    } else {
      router.push("/"); // Redirect to login if not authenticated
    }
  };

  return (
    <AppBar
      position="static"
      color="light"
      sx={{ bgcolor: "light.main" }}
      variant="outlined"
    >
      <Toolbar component={"nav"}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            textDecoration: "none",
          }}
        >
          <Logo />
          <Typography variant="h5" color="primary">
            Frame of Mind
          </Typography>
        </Link>

        {components}

        {authUser && (
          <Button color="inherit" onClick={handleNotificationsClick}>
            <Bell variant="contained" size={32} />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
