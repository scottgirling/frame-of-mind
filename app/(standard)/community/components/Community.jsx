"use client";
import { useEffect, useState } from "react";
import fetchCompletedComics from "../utils/fetchCompletedComics";
import { doc } from "firebase/firestore";

import { Button, ButtonGroup, Typography } from "@mui/material";

export default function Community() {
  const [comics, setComics] = useState([]);
  const [comicPanels, setComicPanels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCompletedComics();
      setComics(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <ButtonGroup sx={{ mb: 2, gap: 0.5, justifyContent: "center" }}>
        <Button href={"/"} size="large" variant="contained">
          Home
        </Button>

        <Button href={"/create"} size="large" variant="contained">
          Create
        </Button>
      </ButtonGroup>

      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Community
      </Typography>
      <div>
        {comics.map((comic) => (
          <div key={comic.id}>
            <Typography variant="body1">{comic.comicTheme}</Typography>
            <Typography variant="body2">
              Created: {comic.createdAt.toDate().toLocaleDateString()}
            </Typography>
            {/* <img src="" alt="" /> */}
          </div>
        ))}
      </div>
    </>
  );
}
