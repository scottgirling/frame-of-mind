import { AppBar, Toolbar, Typography } from "@mui/material";
import Logo from "./Logo";
import Avatar from "./Avatar";

export default function TopBar() {
  return (
    <AppBar position="static" color="light" variant="outlined">
      <Toolbar component={"nav"}>
        <Logo />{" "}
        <Typography variant="h5" color="primary">
          Frame of Mind
        </Typography>{" "}
        <Avatar sx={{ ml: "auto" }} />
      </Toolbar>
    </AppBar>
  );
}
