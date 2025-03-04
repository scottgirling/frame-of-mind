"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuthContext } from "../contexts/LoggedInUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, []);

  if (user)
    return (
      <>
        {console.log(user)}
        <p>You are logged in as {user.displayName}</p>
        <button
          className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300 mt-5"
          onClick={() => {
            signOut(auth);
            router.push("/login");
          }}
        >
          Sign out
        </button>
      </>
    );
}
