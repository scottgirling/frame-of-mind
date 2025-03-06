import handleEmailLogin from "@/app/auth/utils/handleEmailLogin";
import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function LoginForm({ setCurrentForm, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleEmailLogin(email, password, setLoading);
        setCurrentForm(null);
      }}
    >
      <TextField
        label="Email"
        type="email"
        required
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        required
        variant="outlined"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        variant="contained"
        type="submit"
        className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
      >
        Sign in
      </Button>
    </form>
  );
}
