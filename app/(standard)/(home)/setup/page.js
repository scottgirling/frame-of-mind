"use client";

import { auth } from "@/lib/firebase";
import {
  Box,
  Button,
  CircularProgress,
  Switch,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createNewComic from "./utils/createNewComic";
import addPanelToComic from "./utils/addPanelToComic";
import fetchExistingComics from "./utils/fetchExistingComics";
import fetchInProgressPanels from "./utils/fetchInProgressPanels";
import filterYesterdaysComics from "./utils/filterYesterdaysComics";
import deletePanel from "./utils/deletePanel";

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
  const [panelInProgressId, setPanelInProgressId] = useState(null);
  const [selectedComic, setSelectedComic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch the panel in progress
  useEffect(() => {
    if (authUser) {
      fetchInProgressPanels(
        authUser.uid,
        setIsPanelInProgress,
        setLoading,
        isSolo
      ).then((panels) => {
        if (panels.length) {
          setPanelInProgressId(panels[0].id);
        } else {
          setPanelInProgressId(null);
        }
      });
      fetchExistingComics(authUser.uid, setExistingComics, setLoading, isSolo);
    }
  }, [authUser, isSolo]);

  // useEffect(() => {
  //   setLoading(true);
  //   fetchExistingComics(authUser.uid, setExistingComics, setLoading, isSolo)
  //     .then(() => {
  //       if (isNewComic) {
  //         const comicsCreatedInLast24Hours =
  //           filterYesterdaysComics(existingComics);
  //         console.log(comicsCreatedInLast24Hours);
  //         if (
  //           (!isSolo && !comicsCreatedInLast24Hours.length) ||
  //           (isSolo && existingComics.length < 3)
  //         ) {
  //           createNewComic(authUser.uid, isSolo);
  //           router.push("/create");
  //         } else {
  //           isSolo
  //             ? setError(
  //                 "You have reached your new comic limit. Please complete one of your existing comics before starting a new one!"
  //               )
  //             : setError(
  //                 "You have reached your daily new comic limit. You can only create one new team comic each day. Please contribute to an existing team comic or go solo!"
  //               );
  //         }
  //       } else {
  //         if (isSolo && existingComics.length) {
  //           setShowExistingComics(true);
  //         } else if (!isSolo && existingComics.length) {
  //           const oldestComic = existingComics[0];
  //           const oldestComicId = oldestComic.id;
  //           addPanelToComic(authUser.uid, oldestComicId);
  //           router.push("/create");
  //         }
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [existingComics, isSolo]);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedComic(null);
  };

  async function handleContinueExistingClick() {
    if (isSolo && panelInProgressId) {
      setOpenDialog(true);
    } else if (!isSolo) {
      addPanelToComic(authUser.uid, selectedComic.id);
      router.push("/create");
    }
  }

  async function handleNewComicClick() {
    if (authUser) {
      setIsNewComic(true);
      await fetchExistingComics(
        authUser.uid,
        setExistingComics,
        setLoading,
        isSolo
      );
    }

    if (isSolo) {
      if (existingComics.length >= 5) {
        setError(
          "You have reached your solo comic limit. Please complete one of your existing comics before starting a new one!"
        );
      } else {
        createNewComic(authUser.uid, isSolo);
        router.push("/create");
      }
    } else {
      const comicsCreatedInLast24Hours = filterYesterdaysComics(existingComics);
      if (comicsCreatedInLast24Hours.length > 0) {
        setError("You can only create one team comic every 24 hours.");
      } else {
        createNewComic(authUser.uid, isSolo);
        router.push("/create");
      }
    }
  }

  function handleContinueDrawing() {
    // Continue drawing on the selected comic
    if (selectedComic && panelInProgressId) {
      addPanelToComic(authUser.uid, selectedComic.id);
      router.push("/create");
      setOpenDialog(false);
    }
  }

  function handleDiscardPanel() {
    // Discard the in-progress panel and delete it
    if (selectedComic && panelInProgressId) {
      deletePanel(authUser.uid, selectedComic.id, panelInProgressId)
        .then(() => {
          setOpenDialog(false);
        })
        .catch((error) => console.error("Error deleting panel:", error));
    }
  }

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
        <Button variant="contained" onClick={handleContinueExistingClick}>
          Continue existing comic
        </Button>
        <Button variant="contained" onClick={handleNewComicClick}>
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
                        setSelectedComic(comic);
                        handleContinueExistingClick();
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Panel In Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have a panel in progress. Do you want to continue with it or
            discard it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleContinueDrawing}>Continue Drawing</Button>
          <Button onClick={handleDiscardPanel}>Discard Panel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
