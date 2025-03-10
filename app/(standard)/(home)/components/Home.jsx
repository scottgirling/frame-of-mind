import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button, Typography } from "@mui/material";

export default function HomePage({ user }) {
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
