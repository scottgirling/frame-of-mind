"use client";

import { auth } from "@/lib/firebase";
import {
  Box,
  Button,
  CircularProgress,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createNewComic from "./utils/createNewComic";
import addPanelToComic from "./utils/addPanelToComic";
import fetchExistingComics from "./utils/fetchExistingComics";
import { Timestamp } from "firebase/firestore";
import fetchInProgressPanels from "./utils/fetchInProgressPanels";

export default function CreateComicPage() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isSolo, setIsSolo] = useState(true);
  const [isNewComic, setIsNewComic] = useState(false);
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingComics, setExistingComics] = useState([]);
  const [error, setError] = useState(null);
  const [isPanelInProgress, setIsPanelInProgress] = useState(false);
  const [alert, setAlert] = useState("");

  function filterYesterdaysComics(existingComics) {
    const now = Timestamp.now().toMillis();
    const yesterday = now - 24 * 60 * 60 * 1000;
    return existingComics.filter((comic) => {
      const createdAtInMillis = comic.createdAt?.toMillis();
      return createdAtInMillis && createdAtInMillis >= yesterday;
    });
  }

  // useEffect(() => {
  //   fetchInProgressPanels(authUser.uid, setIsPanelInProgress, setLoading, isSolo);
  //   console.log(isPanelInProgress)
  // }, [])

  useEffect(() => {
    setLoading(true);
    fetchInProgressPanels(
      authUser.uid,
      setIsPanelInProgress,
      setLoading,
      isSolo
    )
      .then(() => {
        if (!isPanelInProgress) {
          if (isNewComic) {
            const comicsCreatedInLast24Hours =
              filterYesterdaysComics(existingComics);
            console.log(comicsCreatedInLast24Hours);
            if (
              (!isSolo && !comicsCreatedInLast24Hours.length) ||
              (isSolo && existingComics.length < 3)
            ) {
              createNewComic(authUser.uid, isSolo);
              router.push("/create");
            } else {
              isSolo
                ? setError(
                    "You have reached your new comic limit. Please complete one of your existing comics before starting a new one!"
                  )
                : setError(
                    "You have reached your daily new comic limit. You can only create one new team comic each day. Please contribute to an existing team comic or go solo!"
                  );
            }
          } else {
            if (isSolo && existingComics.length) {
              setShowExistingComics(true);
            } else if (!isSolo && existingComics.length) {
              const oldestComic = existingComics[0];
              const oldestComicId = oldestComic.id;
              addPanelToComic(authUser.uid, oldestComicId);
              router.push("/create");
            }
          }
        }
      })
      .then(() => {
        setLoading(false);
      });
  }, [existingComics]);

  return (
    <Box component={"section"}>
      <p>Choose your gameplay modes below!</p>
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
          onClick={async () => {
            if (authUser) {
              setIsNewComic(false);
              await fetchExistingComics(
                authUser.uid,
                setExistingComics,
                setLoading,
                isSolo
              );
            }
          }}
        >
          Continue existing comic
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            setIsNewComic(true);
            await fetchExistingComics(
              authUser.uid,
              setExistingComics,
              setLoading,
              isSolo
            );
          }}
        >
          New comic
        </Button>
      </Box>
      <Box>
        {loading && <CircularProgress />}
        {error && <p>{error}</p>}
        {isPanelInProgress && <p>Panel in progress</p>}
        {!loading && showExistingComics && (
          <div>
            {existingComics.length === 0 ? (
              <Typography variant="body1">No existing comics found</Typography>
            ) : (
              existingComics.map((comic) => {
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
