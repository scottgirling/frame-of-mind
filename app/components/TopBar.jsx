import { AppBar, Toolbar, Typography } from "@mui/material";
import Logo from "./Logo";
import Link from "next/link";

export default function TopBar({ components }) {
  return (
    <AppBar position="static" color="light" variant="outlined">
      <Toolbar component={"nav"}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            textDecoration: "none",
          }}
        >
          <Logo />
          <Typography variant="h5" color="primary">
            Frame of Mind
          </Typography>
        </Link>

        {components}
      </Toolbar>
    </AppBar>
  );
}
