import handleEmailLogin from "@/utils/handleEmailLogin";
import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function LoginForm({ setCurrentForm }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            handleEmailLogin(email, password);
            setCurrentForm(null);
        }}>
        <TextField
          id="standard-basic"
          label="Email"
          type="email"
          required
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="standard-basic"
          label="Password"
          type="password"
          required
          variant="standard"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          variant="outlined"
          type="submit"
          className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
        >
          Sign in
        </Button>
      </form>
    )
}