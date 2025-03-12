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
import { useRouter } from "next/navigation";
import createNewComic from "./utils/createNewComic";
import addPanelToComic from "./utils/addPanelToComic";
import fetchExistingComics from "./utils/fetchExistingComics";
import fetchInProgressPanels from "./utils/fetchInProgressPanels";
import filterYesterdaysComics from "./utils/filterYesterdaysComics";
import deletePanel from "./utils/deletePanel";
import PaperBox from "@/app/components/PaperBox";
import PaperButton from "@/app/components/PaperButton";

export default function CreateComicPage() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [fetchingExistingComics, setFetchingExistingComics] = useState(false);
  const [error, setError] = useState(null);
  const [isSolo, setIsSolo] = useState(true);
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingComics, setExistingComics] = useState([]);
  const [panelsInProgress, setPanelsInProgress] = useState([]);
  const [selectedComic, setSelectedComic] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // When switching modes, ensure existing comics is hidden
  useEffect(() => {
    setShowExistingComics(false);
    setError(null);
  }, [isSolo]);

  // Fetch the panels in progress + existing comics
  useEffect(() => {
    if (authUser) {
      setFetchingExistingComics(true);
      Promise.all([
        fetchInProgressPanels(authUser.uid, isSolo),
        fetchExistingComics(authUser.uid, isSolo),
      ])
        .then(([panels, comics]) => {
          setPanelsInProgress(panels);
          setExistingComics(comics);
        })
        .finally(() => setFetchingExistingComics(false));
    }
  }, [authUser, isSolo]);

  // Dialog close via 'cancel'
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedComic(null);
  };

  async function handleContinueExistingClick(comic) {
    if (!comic) return;
    setLoading(true);

    if (isSolo) {
      // Solo mode: continue with the user-selected comic
      setSelectedComic(comic);
      const panelForComic = panelsInProgress.find(
        (panel) => panel.comicRef.id === comic.id
      );
      if (panelForComic) {
        handleContinueDrawing();
        setLoading(false);
      } else {
        // If no solo panel in progress, then add panel to comic
        const panelId = await addPanelToComic(authUser.uid, comic.id, isSolo);
        router.push("/create/" + comic.id + "/" + panelId);
      }
    } else {
      // Team mode:
      // First check if any team panel is already in progress.
      if (panelsInProgress.length > 0) {
        const teamPanelInProgress = panelsInProgress[0];
        setSelectedComic({ id: teamPanelInProgress.comicRef.id });
        setOpenDialog(true);
        setLoading(false);
      } else {
        // If no team panel in progress, then add panel to comic
        setSelectedComic(comic);
        const panelId = await addPanelToComic(authUser.uid, comic.id, isSolo);
        router.push("/create/" + comic.id + "/" + panelId);
      }
    }
  }

  async function handleNewComicClick() {
    if (!authUser) return;
    setLoading(true);

    const comics = await fetchExistingComics(authUser.uid, isSolo);
    setExistingComics(comics);

    // Solo mode: check against solo comic limit of 5
    if (isSolo) {
      if (comics.length >= 5) {
        setError(
          "You have reached your solo comic limit. Please complete one of your existing comics before starting a new one!"
        );
        setLoading(false);
        return;
      }
    } else {
      // Team mode:
      // First check if any team panel is already in progress.
      if (panelsInProgress.length) {
        const teamPanelInProgress = panelsInProgress[0];
        setSelectedComic({ id: teamPanelInProgress.comicRef.id });
        setOpenDialog(true);
        setLoading(false);
        return;
      }
      // If no panel in progress, enforce 24h cooling off period
      const comicsCreatedInLast24Hours = filterYesterdaysComics(comics);
      if (comicsCreatedInLast24Hours.length) {
        setError("You can only create one team comic every 24 hours.");
        setLoading(false);
        return;
      }
    }
    // If no panels in progress and within limit then create new
    const [comicId, panelId] = await createNewComic(authUser.uid, isSolo);
    router.push("/create/" + comicId + "/" + panelId);
  }

  // Dialog: Continue drawing on the selected comic
  function handleContinueDrawing() {
    setLoading(true);
    setOpenDialog(true);
    if (selectedComic) {
      const panelForComic = panelsInProgress.find((panel) => {
        return panel.comicRef.id === selectedComic.id;
      });
      if (panelForComic) {
        router.push("/create/" + selectedComic.id + "/" + panelForComic.id);
      }
      setOpenDialog(false);
    }
  }

  //  Dialog: Discard and delete the in-progress panel
  async function handleDiscardPanel() {
    if (!selectedComic) return;

    const panelForComic = panelsInProgress.find((panel) => {
      return panel.comicRef.id === selectedComic.id;
    });
    if (panelForComic) {
      try {
        await deletePanel(
          authUser.uid,
          selectedComic.id,
          panelForComic.id,
          false
        );
        const panelId = await addPanelToComic(
          authUser.uid,
          selectedComic.id,
          isSolo
        );
        router.push("/create/" + selectedComic.id + "/" + panelId);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error deleting panel:", error);
      }
    }
  }

  // if (!authUser) {
  //   return <NotLoggedIn />;
  // }
  if (loading) return;
  <PaperBox
    colour="light"
    variant="main"
    margin={{ m: "auto" }}
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 3,
      px: 6,
      py: 4,
      pb: 2,
    }}
  >
    <CircularProgress />
  </PaperBox>;

  return (
    <PaperBox
      colour="light"
      variant="main"
      margin={{ m: "auto" }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        px: 6,
        py: 4,
        pb: 2,
      }}
    >
      <Typography variant="h1" fontSize={30}>
        Choose your gameplay mode below!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
          fontSize: 30,
        }}
      >
        Solo
        <Switch
          onClick={() => {
            setIsSolo(!isSolo);
          }}
        />
        Team
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "50%",
          gap: 1.5,
        }}
      >
        <PaperButton
          variant="primary"
          sx={{ fontSize: 20, textWrap: "nowrap" }}
          onClick={() => {
            if (isSolo) {
              setShowExistingComics(true);
            } else {
              // In team mode, use oldest comic
              if (panelsInProgress.length) {
                handleContinueExistingClick(panelsInProgress[0].comicRef);
                return;
              } else if (existingComics.length === 0) {
                setError("No existing comics found.");
                return;
              }
              handleContinueExistingClick(existingComics[0]);
            }
          }}
        >
          Continue existing comic
        </PaperButton>
        <PaperButton
          variant="primary"
          sx={{ fontSize: 20, textWrap: "nowrap" }}
          onClick={handleNewComicClick}
        >
          Start a new comic
        </PaperButton>
      </Box>
      <Box>
        {fetchingExistingComics && showExistingComics && <CircularProgress />}
        {error && <p>{error}</p>}
        {!loading && showExistingComics && isSolo && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {existingComics.length === 0 ? (
              <Typography variant="body1">
                No existing comics found. Start a new one by clicking the new
                comic button above!
              </Typography>
            ) : (
              existingComics.map((comic) => {
                return (
                  <Button
                    key={comic.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleContinueExistingClick(comic);
                    }}
                  >
                    {comic.comicTheme}
                  </Button>
                );
              })
            )}
          </Box>
        )}
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Panel In Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You already have a panel in progress. Do you want to continue
            drawing or discard it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleContinueDrawing}>Continue Drawing</Button>
          <Button onClick={handleDiscardPanel}>Discard Panel</Button>
        </DialogActions>
      </Dialog>
    </PaperBox>
  );
}
