import { Box, CircularProgress, Typography } from "@mui/material";
import getPanelInfo from "../utils/getPanelInfo";
import { useEffect, useState } from "react";

export default function Panel({ panelRef }) {
  const [panelInfo, setPanelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPanel(panelRef) {
      try {
        setLoading(true);

        const panelInfo = await getPanelInfo(panelRef);
        setPanelInfo(panelInfo);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
    fetchPanel(panelRef);
  }, [panelRef]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading panel.</Typography>;
  if (!panelInfo) return <Typography>No panel data found.</Typography>;

  return (
    <Box sx={{ width: "100%", margin: "auto", textAlign: "center" }}>
      <Box
        component="img"
        src={panelInfo.drawingDataUrl}
        alt="Comic Panel"
        sx={{
          height: "auto",
          width: "100%",
          marginBottom: 1,
        }}
      />
      <Box
        sx={{
          width: "100%",
          padding: 0.5,
        }}
      >
        <Typography variant="body1">{panelInfo.panelCaption}</Typography>
      </Box>
    </Box>
  );
}
