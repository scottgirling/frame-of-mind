import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button, Typography } from "@mui/material";
import Streaks from "@/app/components/streak/Streaks";
import { doc, getDoc } from "@firebase/firestore";

export default function HomePage({ user }) {
  const userRef = doc(db, "users", user.uid);

  return (
    <>
      <Button
        href={"/create"}
        size="large"
        variant="contained"
        sx={{ mx: "auto", mb: 5 }}
      >
        Create
      </Button>
      <Streaks userRef={userRef} />
      <Typography variant="body1">
        You are logged in as {user.displayName}
      </Typography>
      <Button
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </Button>
    </>
  );
}
