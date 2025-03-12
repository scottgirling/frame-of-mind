import { Box, Grid2 as Grid, Typography } from "@mui/material";
import Streaks from "@/app/components/streak/Streaks";
import PaperButton from "@/app/components/PaperButton";
import { PaintBrush } from "@phosphor-icons/react/dist/ssr";
import PaperBox from "@/app/components/PaperBox";
import { Palette } from "@phosphor-icons/react";

export default function HomePage({ user }) {
  return (
    <>
      <Typography
        variant="h1"
        sx={{ fontSize: 30, textAlign: "center", mb: 4 }}
      >
        Welcome back {user.displayName}!
      </Typography>
      <Box sx={{ mx: "auto" }}>
        <PaperButton
          href={"/create"}
          variant="green"
          margin={{ mx: 1, mb: 5 }}
          sx={{ fontSize: "3rem", pr: 5, pl: 4, pt: 0 }}
          rotation={2}
        >
          <PaintBrush style={{ marginRight: ".5rem", marginTop: ".5rem" }} />{" "}
          Create
        </PaperButton>

        <PaperButton
          href={"/community"}
          variant="primary"
          margin={{ mx: 1, mb: 5 }}
          sx={{ fontSize: "3rem", pr: 5, pl: 4, pt: 0 }}
          rotation={-1}
        >
          <Palette style={{ marginRight: ".5rem", marginTop: ".5rem" }} />{" "}
          Community
        </PaperButton>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ md: 6 }}>
          <Streaks user={user} />
        </Grid>
        <Grid size={{ md: 6 }}>
          <PaperBox
            colour="primary"
            variant="light"
            sx={{ p: 5, height: "100%" }}
            margin={{ height: "100%" }}
            rotation={-1}
          >
            <Typography>Lorem ipsum...</Typography>
          </PaperBox>
        </Grid>
      </Grid>
    </>
  );
}
