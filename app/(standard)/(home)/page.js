"use client";

import HomePage from "./components/Home";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import NotLoggedIn from "@/app/components/authentication/NotLoggedIn";
import PaperBox from "@/app/components/PaperBox";

export default function Home() {
  const [authUser] = useAuthState(auth);
  let returnElement;
  if (authUser && Object.keys(authUser).length) {
    returnElement = <HomePage user={authUser} />;
  } else {
    returnElement = <NotLoggedIn />;
  }
  return (
    <PaperBox
      colour="light"
      variant="main"
      borderSize={15}
      margin={{ my: "auto" }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: 5,
      }}
    >
      {returnElement}
    </PaperBox>
  );
}
