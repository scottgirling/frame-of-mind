"use client";

import { db, auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { useAuthContext } from "../contexts/LoggedInUser";
import { useEffect, useState } from "react";
import signIn from "../auth/signIn";
import { doc, setDoc } from "firebase/firestore";
import { TextField, Button } from "@mui/material";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuthContext();
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleForm = async (event) => {
    event.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      return console.log(error);
    }
    router.push("/home");
  };

  async function handleLogIn() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
      });
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (user) router.push("/home");
  }, []);

  if (showLoginForm)
    return (
      <form onSubmit={handleForm}>
        <TextField
          id="standard-basic"
          label="Email"
          type="email"
          required
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="standard-basic"
          label="Password"
          type="password"
          required
          variant="standard"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          variant="outlined"
          type="submit"
          className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
        >
          Sign in
        </Button>
      </form>
    );

  return (
    <section className="flex gap-1">
      <Button
        variant="outlined"
        className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
        onClick={handleLogIn}
      >
        Sign in with Google Account
      </Button>
      <Button
        variant="outlined"
        className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
        onClick={() => {
          setShowLoginForm(true);
        }}
      >
        Sign in with Email & Password
      </Button>

      <Button
        variant="outlined"
        className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
        onClick={() => {
          router.push("/signup");
        }}
      >
        Sign up with Email & Password
      </Button>
    </section>
  );
}