"use client";
import { useState } from "react";
import Canvas from "../components/canvas";
import TopBar from "@/app/components/TopBar";
import Avatar from "@/app/components/Avatar";
import { Box, Button } from "@mui/material";

export default function Create() {
  const [rawDrawingData, setRawDrawingData] = useState([]);
  return (
    <>
      <TopBar
        components={
          <>
            <Button
              sx={{ ml: "auto", mr: 2 }}
              variant="contained"
              onClick={() => {
                const rawDrawingDataString = JSON.stringify(rawDrawingData);
                console.log(rawDrawingDataString);
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
