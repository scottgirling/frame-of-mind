"use client";

import Profile from "./components/Profile";
import PaperBox from "@/app/components/PaperBox";

export default function profilePage() {
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
      <Profile />
    </PaperBox>
  );
}
