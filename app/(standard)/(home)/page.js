"use client";

import HomePage from "./components/Home";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import NotLoggedIn from "@/app/components/authentication/NotLoggedIn";

export default function Home() {
  const [authUser] = useAuthState(auth);
  if (authUser && Object.keys(authUser).length) {
    return <HomePage user={authUser} />;
  }
  return <NotLoggedIn />;
}
