"use client";

import { useState } from "react";
import HomePage from "./components/Home";
import LoginButtons from "./components/LoginButtons";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [currentForm, setCurrentForm] = useState(null);
  const [authUser, loading, error] = useAuthState(auth);
  const [pageLoading, setLoading] = useState(false);

  if (loading || pageLoading) {
    return <CircularProgress />;
  }

  if (authUser && Object.keys(authUser).length) {
    return <HomePage user={authUser} />;
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
