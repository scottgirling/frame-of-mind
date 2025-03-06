import { AppBar, Toolbar, Typography } from "@mui/material";
import Logo from "./Logo";
import Link from "next/link";

export default function TopBar({ components }) {
  return (
    <AppBar position="static" color="light" variant="outlined">
      <Toolbar component={"nav"}>
        <Link href="/">
          <Logo />
          <Typography
            sx={{ display: "inline", verticalAlign: "middle", ml: 1 }}
            variant="h5"
            color="primary"
          >
            Frame of Mind
          </Typography>
        </Link>

        {components}
      </Toolbar>
    </AppBar>
  );
}
