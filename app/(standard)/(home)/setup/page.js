"use client";

import { auth, db } from "@/lib/firebase";
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
import { doc } from "@firebase/firestore";

export default function CreateComicPage() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isSolo, setIsSolo] = useState(true);
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingComics, setExistingComics] = useState([]);
  const [error, setError] = useState(null);
  const [panelsInProgress, setPanelsInProgress] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch the panels in progress + existing comics
  useEffect(() => {
    if (authUser) {
      setLoading(true);
      fetchInProgressPanels(authUser.uid, setLoading, isSolo).then((panels) => {
        setPanelsInProgress(panels);
      });
      fetchExistingComics(authUser.uid, isSolo).then((comics) => {
        setExistingComics(comics);
        setLoading(false);
      });
    }
  }, [authUser, isSolo]);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedComic(null);
  };

  async function handleContinueExistingClick() {
    if (isSolo) {
      setShowExistingComics(true);
      if (!selectedComic) return;

      const panelForComic = panelsInProgress.find((panel) => {
        const comicRef = doc(db, "comics", selectedComic.id);
        return panel.comicRef === comicRef;
      });

      if (panelForComic) {
        setOpenDialog(true);
      } else {
        await addPanelToComic(authUser.uid, selectedComic.id, isSolo);
        router.push("/create");
      }
    } else {
      // Team mode logic
      if (existingComics.length === 0) {
        setError("No existing comics found.");
        return;
      }
      const oldestComic = existingComics[0];
      const panelForComic = panelsInProgress.find((panel) => {
        const comicRef = doc(db, "comics", oldestComic.id);
        return panel.comicRef === comicRef;
      });
      if (panelForComic) {
        // Set the oldest comic as selected
        setSelectedComic(oldestComic);
        setOpenDialog(true);
      } else {
        await addPanelToComic(authUser.uid, oldestComic.id, isSolo);
        router.push("/create");
      }
    }
  }

  async function handleNewComicClick() {
    if (authUser) {
      fetchExistingComics(authUser.uid, isSolo).then((comics) => {
        setExistingComics(comics);
      });
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
      // Team mode logic
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
    if (selectedComic) {
      const panelForComic = panelsInProgress.find((panel) => {
        const comicRef = doc(db, "comics", selectedComic.id);
        panel.comicRef === comicRef;
      });
      if (panelForComic) {
        router.push("/create");
      }
      setOpenDialog(false);
    }
  }

  // Discard the in-progress panel and delete it via util
  function handleDiscardPanel() {
    if (selectedComic) {
      const panelForComic = panelsInProgress.find((panel) => {
        const comicRef = doc(db, "comics", selectedComic.id);
        panel.comicRef === comicRef;
      });
      if (panelForComic) {
        deletePanel(authUser.uid, selectedComic.id, panelForComic.id)
          .then(() => {
            setPanelsInProgress((prev) =>
              prev.filter((panel) => panel.id !== panelForComic.id)
            );
            setOpenDialog(false);
          })
          .catch((error) => console.error("Error deleting panel:", error));
      }
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
        {!loading && showExistingComics && isSolo && (
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
