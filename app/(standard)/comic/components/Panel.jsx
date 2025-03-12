import { Box, CircularProgress, Typography } from "@mui/material";
import getPanelInfo from "../utils/getPanelInfo";
import { useEffect, useState } from "react";
import PaperBox from "@/app/components/PaperBox";

export default function Panel({ panelRef, i }) {
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
    <PaperBox
      variant="light"
      colour="light"
      sx={{
        width: "100%",
        textAlign: "center",
        p: 1,
        transform: `rotate(${i % 2 ? 1 : -1}deg)`,
      }}
    >
      <Box
        component="img"
        src={panelInfo.drawingDataUrl}
        alt="Comic Panel"
        sx={{
          height: "auto",
          width: "100%",
          bgcolor: "white",
          mx: "auto",
          imageRendering: "smooth",
        }}
      />
      <Box
        sx={{
          width: "100%",
          padding: 0.5,
          mb: 1,
        }}
      >
        <Typography variant="body1">{panelInfo.panelCaption}</Typography>
      </Box>
    </PaperBox>
  );
}
