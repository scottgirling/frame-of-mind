import { Box, Button } from "@mui/material";
import TopBar from "../components/TopBar";
import Avatar from "../components/Avatar";

export default function CanvasLayout({ children }) {
  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar
        components={
          <>
            <Button sx={{ ml: "auto", mr: 2 }} variant="contained">
              Submit
            </Button>
            <Avatar />
          </>
        }
      />
      <Box
        component={"main"}
        sx={{
          mt: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          maxHeight: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
