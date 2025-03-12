"use client";
import { useEffect, useState } from "react";
import fetchCompletedComics from "../utils/fetchCompletedComics";
import fetchComicPanel from "../utils/fetchComicPanel";

import { Button, ButtonGroup, Typography, Grid2 } from "@mui/material";

export default function Community() {
  const [comics, setComics] = useState([]);

  console.log(comics, "<======COMICS");

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCompletedComics();

      for (const comic of data) {
        const firstPanelImage = await fetchComicPanel(comic.panels[0]);
        comic.firstPanelImage = firstPanelImage;
      }

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

      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Community
      </Typography>
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        See what other users have created!
      </Typography>

      <Grid2
        container
        spacing={3}
        sx={{
          justifyContent: "center",
        }}
      >
        {comics.map((comic) => (
          <div key={comic.id}>
            <img src={comic.firstPanelImage} alt="" />
            <Typography variant="body1">{comic.comicTheme}</Typography>
            <Typography variant="body2">
              Created: {comic.createdAt.toDate().toLocaleDateString()}
            </Typography>
            <Typography variant="body2">Likes: {comic.comicLikes}</Typography>
          </div>
        ))}
      </Grid2>
    </>
  );
}
