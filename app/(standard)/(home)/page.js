"use client";

import { useAuthContext } from "../../contexts/LoggedInUser";
import { useEffect, useState } from "react";
import HomePage from "./components/Home";
import LoginButtons from "./components/LoginButtons";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

export default function Home() {
  const [currentForm, setCurrentForm] = useState(null);
  const { user } = useAuthContext();

  // useEffect(() => {

  // }, [currentForm])

  if (Object.keys(user).length) {
    return (
      <HomePage user={user}/>
    );
  } 

  if (currentForm === "login" ) {
    return <LoginForm setCurrentForm={setCurrentForm} />
  }

  if (currentForm === "signup" ) {
    return <SignUpForm setCurrentForm={setCurrentForm} />
  }

  return <LoginButtons setCurrentForm={setCurrentForm} />
}
