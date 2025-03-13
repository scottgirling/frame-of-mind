import handleEmailLogin from "@/app/auth/utils/handleEmailLogin";
import {
  Box,
  Button,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function LoginForm({ setCurrentForm, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box
      component="form"
      sx={{ p: 5, maxWidth: "700px", mx: "auto" }}
      onSubmit={(event) => {
        event.preventDefault();
        handleEmailLogin(email, password, setLoading);
        setCurrentForm(null);
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "2.5rem", mb: 1 }}>
        Sign in
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, fontSize: "1.3rem", color: "primary.emphasis" }}
      >
        Enter your email and password
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            required
            variant="outlined"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            required
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Grid>
        <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
          <Button
            size={"large"}
            type="submit"
            variant="outlined"
            onClick={() => {
              setCurrentForm(null);
            }}
          >
            Cancel
          </Button>
          <Button
            size={"large"}
            variant="contained"
            type="submit"
            className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
          >
            Sign in
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
