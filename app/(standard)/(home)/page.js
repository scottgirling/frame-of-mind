"use client";

import { useAuthContext } from "../../contexts/LoggedInUser";
import { useEffect, useState } from "react";
import HomePage from "./components/Home";
import LoginButtons from "./components/LoginButtons";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

export default function Home() {
  const [currentForm, setCurrentForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userLoading } = useAuthContext();

  // useEffect(() => {

  // }, [loading]);

  if (loading || userLoading) {
    return <p>Loading... </p>;
  }

  if (Object.keys(user).length) {
    return <HomePage user={user} />;
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
