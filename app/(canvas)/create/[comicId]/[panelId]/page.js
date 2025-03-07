"use client";
import { useState } from "react";
import Canvas from "../components/canvas";
import TopBar from "@/app/components/TopBar";
import Avatar from "@/app/components/Avatar";
import { Box, Button } from "@mui/material";

export default function Create() {
  const [rawDrawingData, setRawDrawingData] = useState([]);

  function handleDiscard() {
    // invoke the util deletePanel here!
  }

  function handleSave() {
    // use updateDoc in-built function to update the panel's rawDD and show a dialog box saying it's been saved
  }

  function handleSubmit() {
    // use updateDoc in-built function to update the panel isInProgress to be false and update the rawDD. Also navigate user to home?
  }

  return (
    <>
      <TopBar
        components={
          <>
            <Button
              sx={{ ml: "auto", mr: 0.5 }}
              variant="outlined"
              onClick={handleDiscard}
            >
              Discard
            </Button>
            <Button
              sx={{ ml: 0.5, mr: 0.5 }}
              variant="outlined"
              onClick={() => {
                const rawDrawingDataString = JSON.stringify(rawDrawingData);
                console.log(rawDrawingDataString);
                handleSave();
              }}
            >
              Save draft
            </Button>
            <Button
              sx={{ ml: 0.5, mr: 2 }}
              variant="contained"
              onClick={() => {
                const rawDrawingDataString = JSON.stringify(rawDrawingData);
                console.log(rawDrawingDataString);
                handleSubmit();
              }}
            >
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
        <Canvas setRawDrawingData={setRawDrawingData} />;
      </Box>
    </>
  );
}
