import { Box } from "@mui/material";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

export default function StandardLayout({ children }) {
  return (
    <>
      <TopBar />
      <Box component={"main"} sx={{ mx: "auto", mt: "1.25rem" }}>
        <section>{children}</section>
      </Box>
      <BottomBar />
    </>
  );
}
