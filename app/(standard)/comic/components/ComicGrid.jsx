import { Grid2 as Grid } from "@mui/material";
import Panel from "./Panel";

export default function ComicGrid({ panels }) {
  return (
    <Grid container spacing={2}>
      {panels?.map((panel, i) => (
        <Grid
          key={i}
          size={3}
          sx={{
            border: "1px solid",
            borderRadius: 3,
            bgcolor: "primary.light",
            aspectRatio: "1/1",
          }}
        >
          <Panel key={i} panelRef={panel} />
        </Grid>
      ))}
    </Grid>
  );
}
