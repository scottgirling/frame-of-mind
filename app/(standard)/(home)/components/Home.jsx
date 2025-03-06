import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button, Typography } from "@mui/material";

export default function HomePage({ user }) {
  return (
    <>
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
