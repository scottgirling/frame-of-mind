import { Grid2 as Grid } from "@mui/material";
import Panel from "./Panel";

export default function ComicGrid({ panels }) {
  return (
    <Grid
      container
      spacing={5}
      columns={4}
      sx={{ justifyContent: "center", mx: { xl: -15 } }}
    >
      {panels?.map((panel, i) => (
        <Grid key={i} size={{ md: 2, lg: 1, sx: 4 }} sx={{ maxWidth: "400px" }}>
          <Panel key={i} panelRef={panel} i={i} />
        </Grid>
      ))}
    </Grid>
  );
}
