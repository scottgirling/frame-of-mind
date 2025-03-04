"use client";

import { useEffect } from "react";
import { useAuthContext } from "./contexts/LoggedInUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    if (Object.keys(user).length) router.push("/home");
    else router.push("/login");
  }, []);
}
