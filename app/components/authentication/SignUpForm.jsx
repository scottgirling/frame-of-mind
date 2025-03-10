import signUp from "@/app/auth/signUp";
import {
  Button,
  TextField,
  Box,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function SignUpForm({ setCurrentForm, setLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function handleForm(event) {
    event.preventDefault();
    await signUp(displayName, email, password, setLoading);
    setCurrentForm(null);
  }

  return (
    <Box
      component="form"
      sx={{ p: 5, maxWidth: "700px", mx: "auto", bgcolor: "light.light" }}
      onSubmit={handleForm}
    >
      <Typography variant="h1" sx={{ fontSize: "2.5rem", mb: 1 }}>
        Create Account
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, fontSize: "1.3rem", color: "primary.emphasis" }}
      >
        Enter your details below
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@website.com"
            value={email}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            placeholder="Your username"
            value={displayName}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Your password"
            value={password}
            required
          />
        </Grid>

        <Grid size={12} sx={{ display: "flex", gap: 2, justifyContent: "end" }}>
          <Button
            type="submit"
            variant="outlined"
            onClick={() => {
              setCurrentForm(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Sign up
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
