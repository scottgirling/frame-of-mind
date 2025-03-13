import handleGoogleLogIn from "@/app/auth/utils/handleGoogleLogin";
import { Box, Button, Typography } from "@mui/material";
import SignUpForm from "./SignUpForm";

export default function LoginButtons({ setCurrentForm }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontSize: "2.5rem", mb: 2 }}>
          Sign in
        </Typography>
        <Box display={{ display: "flex", gap: 10 }}>
          <Button variant="outlined" onClick={handleGoogleLogIn}>
            Sign in with Google Account
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setCurrentForm("login");
            }}
          >
            Sign in with Email & Password
          </Button>
        </Box>
      </Box>

      <SignUpForm />
    </Box>
  );
}
