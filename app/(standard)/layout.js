import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import Avatar from "../components/Avatar";

export default function StandardLayout({ children }) {
  return (
    <>
      <TopBar components={<Avatar sx={{ ml: "auto" }} />} />
      <Box component={"main"} sx={{ mx: "auto", mt: "1.25rem" }}>
        <section>{children}</section>
        <section>
          <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
            Go To:
          </Typography>
          <ButtonGroup>
            <Button href="/setup" variant="outlined">
              Create Comic
            </Button>
            <Button href="/create" variant="outlined">
              Drawing Canvas
            </Button>
          </ButtonGroup>
        </section>
      </Box>
      <BottomBar />
    </>
  );
}
