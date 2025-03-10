import handleGoogleLogIn from "@/app/auth/utils/handleGoogleLogin";
import { Button } from "@mui/material";

export default function LoginButtons({ setCurrentForm }) {
  return (
    <section className="flex gap-1">
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

      <Button
        variant="outlined"
        onClick={() => {
          setCurrentForm("signup");
        }}
      >
        Sign up with Email & Password
      </Button>
    </section>
  );
}
