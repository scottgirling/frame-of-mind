import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button, Typography, ButtonGroup } from "@mui/material";
import Streaks from "@/app/components/streak/Streaks";

export default function HomePage({ user }) {
  return (
    <>
      <ButtonGroup sx={{ mb: 5, gap: 0.5, justifyContent: "center" }}>
        <Button href={"/create"} size="large" variant="contained">
          Create
        </Button>
        <Button href={"/community"} size="large" variant="contained">
          Community
        </Button>
      </ButtonGroup>

      <Streaks user={user} />
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
