"use client";
import { auth } from "@/lib/firebase";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import LoginButtons from "./LoginButtons";

export default function NotLoggedIn() {
  const [currentForm, setCurrentForm] = useState(null);
  const [pageLoading, setLoading] = useState(false);

  if (pageLoading) {
    return <CircularProgress sx={{ mx: "auto" }} />;
  }

  if (currentForm === "login") {
    return (
      <LoginForm setCurrentForm={setCurrentForm} setLoading={setLoading} />
    );
  }

  if (currentForm === "signup") {
    return (
      <SignUpForm setCurrentForm={setCurrentForm} setLoading={setLoading} />
    );
  }
  return (
    <LoginButtons setCurrentForm={setCurrentForm} setLoading={setLoading} />
  );
}
