"use client";

import { auth } from "@/lib/firebase";
import { Box, Button, CircularProgress, Switch } from "@mui/material";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createNewComic from "./utils/createNewComic";
import addPanelToComic from "./utils/addPanelToComic";
import fetchExistingSoloComics from "./utils/fetchExistingSoloComics";

export default function CreateComicPage() {
  const router = useRouter();
  const [authUser, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isSolo, setIsSolo] = useState(true);
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingSoloComics, setExistingSoloComics] = useState([]);

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
            if (authUser) {
              setShowExistingComics(true);
              fetchExistingSoloComics(
                authUser.uid,
                setExistingSoloComics,
                setLoading
              );
            }
          }}
        >
          Continue existing comic
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            createNewComic(authUser.uid);
            router.push("/create");
          }}
        >
          New comic
        </Button>
      </Box>
      <Box>
        {loading && <CircularProgress />}
        {!loading && showExistingComics && (
          <div>
            {existingSoloComics.length === 0 ? (
              <p>No existing comics found</p>
            ) : (
              existingSoloComics.map((comic) => {
                return (
                  <div key={comic.id}>
                    {console.log(comic)}
                    <Link
                      href={"/create"}
                      onClick={() => {
                        addPanelToComic(authUser.uid, comic.id);
                      }}
                    >
                      <p>{comic.comicTheme}</p>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Box>
    </Box>
  );
}
