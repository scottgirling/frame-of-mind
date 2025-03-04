import handleGoogleLogIn from "@/utils/handleGoogleLogin";
import { Button } from "@mui/material";

export default function LoginButtons({ setCurrentForm }) {
    return (
        <section className="flex gap-1">
            <Button
                variant="outlined"
                className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
                onClick={handleGoogleLogIn}
            >
                Sign in with Google Account
            </Button>
            <Button
                variant="outlined"
                className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
                onClick={() => {
                    setCurrentForm("login");
                }}
            >
                Sign in with Email & Password
            </Button>

            <Button
                variant="outlined"
                className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
                onClick={() => {
                    setCurrentForm("signup");
                }}
            >
                Sign up with Email & Password
            </Button>
        </section>
    )
}