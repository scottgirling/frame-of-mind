import { Grid2 as Grid, Typography } from "@mui/material";
import Streaks from "@/app/components/streak/Streaks";
import PaperButton from "@/app/components/PaperButton";
import { PaintBrush } from "@phosphor-icons/react/dist/ssr";
import PaperBox from "@/app/components/PaperBox";

export default function HomePage({ user }) {
  return (
    <>
      <Typography
        variant="h1"
        sx={{ fontSize: 30, textAlign: "center", mb: 4 }}
      >
        Welcome back {user.displayName}!
      </Typography>
      <PaperButton
        href={"/create"}
        variant="green"
        margin={{ mx: "auto", mb: 5 }}
        sx={{ fontSize: "3rem", pr: 5, pl: 4, pt: 0 }}
      >
        <PaintBrush style={{ marginRight: ".5rem", marginTop: ".5rem" }} />{" "}
        Create
      </PaperButton>
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
