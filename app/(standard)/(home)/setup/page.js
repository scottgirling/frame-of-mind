"use client";

import { Box, Button, Switch } from "@mui/material";
import { useState } from "react";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

export default function CreateComicPage() {
  const [isSolo, setIsSolo] = useState(true);
  const uid = "YNy86Pz4AY1Mtweqx1hn"; // Fake user id

  function continueExistingSolo(uid) {
    // const [snapshot, loading, error] = useCollectionOnce(query);
    // const existingComics
    // return existingComics
  }

  return (
    <Box component={"section"}>
      <p>Choose your game-play modes below!</p>
      <Box>
        Solo
        <Switch
          onClick={() => {
            setIsSolo(!isSolo);
          }}
        />
        Team
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            continueExistingSolo(uid);
          }}
        >
          Continue existing comic
        </Button>
        <Button variant="contained">New comic</Button>
      </Box>
    </Box>
  );
}
