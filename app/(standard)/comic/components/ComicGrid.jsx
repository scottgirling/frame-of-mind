import { Grid2 as Grid } from "@mui/material";
import Panel from "./Panel";

export default function ComicGrid({ panels }) {
  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      {panels?.map((panel, i) => (
        <Grid key={i} size={{ lg: 4, sm: 6, sx: 12 }}>
          <Panel key={i} panelRef={panel} i={i} />
        </Grid>
      ))}
    </Grid>
  );
}
