import { Box } from "@mui/material";
import TopBar from "../components/TopBar";

export default function CanvasLayout({ children }) {
  return (
    <>
      <TopBar />
      <Box component={"main"} sx={{ mx: "auto", mt: "1.25rem" }}>
        <section>{children}</section>
      </Box>
    </>
  );
}
