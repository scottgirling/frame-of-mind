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
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingComics, setExistingComics] = useState([]);
  const [error, setError] = useState(null);
  const [isPanelInProgress, setIsPanelInProgress] = useState(false);
  const [panelInProgressId, setPanelInProgressId] = useState(null);
  const [selectedComic, setSelectedComic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch the panels in progress + existing comics
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

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedComic(null);
  };

  async function handleContinueExistingClick() {
    if (!selectedComic) return;

    if (panelInProgressId) {
      setOpenDialog(true);
    } else {
      await addPanelToComic(authUser.uid, selectedComic.id, isSolo);
      router.push("/create");
    }
  }

  async function handleNewComicClick() {
    if (authUser) {
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
        await createNewComic(authUser.uid, isSolo);
        router.push("/create");
      }
    } else {
      const comicsCreatedInLast24Hours = filterYesterdaysComics(existingComics);
      if (comicsCreatedInLast24Hours.length > 0) {
        setError("You can only create one team comic every 24 hours.");
      } else {
        await createNewComic(authUser.uid, isSolo);
        router.push("/create");
      }
    }
  }

  function handleContinueDrawing() {
    // Continue drawing on the selected comic
    if (selectedComic && panelInProgressId) {
      addPanelToComic(authUser.uid, selectedComic.id, isSolo);
      router.push("/create");
      setOpenDialog(false);
    }
  }

  // Discard the in-progress panel and delete it via util
  function handleDiscardPanel() {
    if (selectedComic && panelInProgressId) {
      deletePanel(authUser.uid, selectedComic.id, panelInProgressId)
        .then(() => {
          setPanelInProgressId(null);
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
        {!loading && showExistingComics && (
          <div>
            {existingComics.length === 0 ? (
              <Typography variant="body1">
                No existing comics found. Start a new one by clicking the new
                comic button above!
              </Typography>
            ) : (
              existingComics.map((comic) => {
                return (
                  <div key={comic.id}>
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
            You have a panel in progress. Do you want to continue drawing this
            panel or discard it?
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
