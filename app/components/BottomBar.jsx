import { AppBar, Button, Toolbar } from "@mui/material";
import Avatar from "./Avatar";

export default function BottomBar() {
  return (
    <AppBar
      color="light"
      variant="outlined"
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        display: { md: "none" },
      }}
    >
      <Toolbar
        component={"nav"}
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Button>Home</Button>
        <Avatar />
        <Button>Community</Button>
      </Toolbar>
    </AppBar>
  );
}
