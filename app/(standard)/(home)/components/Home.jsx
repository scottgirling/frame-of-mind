import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@mui/material";

export default function HomePage({ user }) {
  return (
    <>
      <p>You are logged in as {user.displayName}</p>
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
