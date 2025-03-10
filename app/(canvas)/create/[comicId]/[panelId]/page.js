"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Canvas from "../components/canvas";
import TopBar from "@/app/components/TopBar";
import Avatar from "@/app/components/Avatar";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";
import { auth, db } from "@/lib/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import deletePanel from "@/app/(standard)/(home)/setup/utils/deletePanel";
import { useParams, useRouter } from "next/navigation";
import { inspireMeGenerator } from "@/app/(standard)/(home)/setup/utils/inspireMeGenerator";
import getData from "@/app/firestore/getData";

export default function Create() {
  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [rawDrawingData, setRawDrawingData] = useState([]);
  const [panelCaption, setPanelCaption] = useState("");
  const [inspireMe, setInspireMe] = useState("");
  const [comicTheme, setComicTheme] = useState(null);
  // Pass setPanelCaption into canvas too?
  const { comicId, panelId } = useParams();
  const [authUser] = useAuthState(auth);
  const router = useRouter();

  const [userRef, setUserRef] = useState(null);
  const comicRef = doc(db, "comics", comicId);
  const panelRef = doc(db, "panels", panelId);
  const [validComic, setValidComic] = useState(null);
  const [validPanel, setValidPanel] = useState(null);

  useEffect(() => {
    currentComicTheme();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUserRef(doc(db, "users", authUser.uid));
    }
  }, [authUser]);

  useEffect(() => {
    async function checkIds() {
      const comicSnapshot = await getDoc(comicRef);
      setValidComic(comicSnapshot._document ? true : false);
      const panelSnapshot = await getDoc(comicRef);
      setValidPanel(panelSnapshot._document ? true : false);
    }
    checkIds();
  }, [comicId, panelId]);

  async function handleDiscard() {
    // Also show a dialog box saying it's been saved?
    if (!comicId || !panelId) return;

    await deletePanel(authUser.uid, comicId, panelId);

    setDialogAction("discard");
    setOpenConfirmationDialog(true);
  }

  async function handleSave() {
    // Also show a dialog box saying it's been saved
    try {
      if (!comicId || !panelId) return;

      const rawDrawingDataString = JSON.stringify(rawDrawingData);
      console.log(rawDrawingDataString);

      await updateDoc(panelRef, {
        rawDrawingDataString,
        // panelCaption update here too?
      });

      setDialogAction("save");
      setOpenConfirmationDialog(true);
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  }

  async function handleSubmit() {
    try {
      if (!comicId || !panelId) return;

      const rawDrawingDataString = JSON.stringify(rawDrawingData);
      console.log(rawDrawingDataString);

      await updateDoc(panelRef, {
        rawDrawingDataString,
        isInProgress: false,
        // panelCaption update here?
      });

      await updateDoc(comicRef, {
        isInProgress: false,
      });

      const comicSnapshot = await getDoc(comicRef);
      if (comicSnapshot.data().panels.length === 8) {
        await updateDoc(comicRef, {
          isCompleted: true,
        });
        await updateDoc(userRef, {
          myComics: arrayUnion(comicRef),
        });
      }

      setDialogAction("submit");
      setOpenConfirmationDialog(true);

      // If comic completed (8 panels), send notification so they can view comic on the completed comic page?
    } catch (error) {
      console.error("Error submitting drawing:", error);
    }
  }

  // Dialog close via 'cancel'
  const handleDialogClose = () => {
    setOpenCheckDialog(false);
    setOpenConfirmationDialog(false);
  };

  async function currentComicTheme() {
    const comicTheme = (
      await getData("comics", "eh2ZYR7ZS9Uh6MMnd5YS")
    ).result.data().comicTheme;
    setComicTheme(comicTheme);
  }

  if (validComic && validPanel) {
    <>
      <TopBar
        components={
          <>
            <Button
              sx={{ ml: "auto", mr: 0.5 }}
              variant="outlined"
              onClick={() => {
                setDialogAction("discard");
                setOpenCheckDialog(true);
              }}
            >
              Discard
            </Button>
            <Button
              sx={{ ml: 0.5, mr: 0.5 }}
              variant="outlined"
              onClick={() => {
                handleSave();
              }}
            >
              Save draft
            </Button>
            <Button
              sx={{ ml: 0.5, mr: 2 }}
              variant="contained"
              onClick={() => {
                setDialogAction("submit");
                setOpenCheckDialog(true);
              }}
            >
              Submit
            </Button>
            <Avatar />
          </>
        }
      />

      <Typography sx={{ m: "auto", mt: 2 }}>{comicTheme}</Typography>

      <Tooltip
        title="Need some inspiration or not sure where to start? An idea is only a click away!"
        arrow
        placement="right"
      >
        <Button
          variant="contained"
          sx={{ m: "auto", mt: 2 }}
          onClick={() => {
            setInspireMe(inspireMeGenerator());
          }}
        >
          Inspire Me
        </Button>
      </Tooltip>

      {inspireMe && (
        <Typography sx={{ m: "auto", mt: 2 }}>Try... {inspireMe}</Typography>
      )}

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

      <Box component="form" sx={{ m: "auto", mb: 5 }}>
        {panelCaption ? (
          <Typography>Panel Caption: {panelCaption}</Typography>
        ) : (
          <TextField
            id="outlined-basic"
            label="Panel Caption"
            variant="outlined"
            required
            helperText="Add a description of what's happening in your panel"
            onBlur={(event) => setPanelCaption(event.target.value)}
          />
        )}
      </Box>
      <Button
        variant="contained"
        sx={{ m: "auto", mt: 2 }}
        onClick={() => setPanelCaption("")}
      >
        Remove Panel Caption
      </Button>
      {console.log(panelCaption, "<--- panelCaption")}

      <Box>
        <Dialog open={openCheckDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {dialogAction === "discard" && "Discard Panel"}
            {dialogAction === "submit" && "Submit Panel"}
          </DialogTitle>
          <DialogContent>
            {dialogAction === "discard" && (
              <Typography variant="body1">
                Are you sure you want to discard this panel? This action cannot
                be undone.
              </Typography>
            )}
            {dialogAction === "submit" && (
              <Typography variant="body1">
                Are you ready to submit your panel? Once submitted, you won't be
                able to make further changes.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            {dialogAction === "discard" && (
              <Button onClick={handleDiscard}>Discard</Button>
            )}
            {dialogAction === "submit" && (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog open={openConfirmationDialog} onClose={handleDialogClose}>
          <DialogTitle>Success!</DialogTitle>
          <DialogContent>
            {dialogAction === "discard" && (
              <Typography variant="body1">
                Panel successfully deleted. Click below to return to home.
              </Typography>
            )}
            {dialogAction === "save" && (
              <Typography variant="body1">
                Panel successfully saved. Click below to return to home.
              </Typography>
            )}
            {dialogAction === "submit" && (
              <Typography variant="body1">
                Panel successfully submitted. Click below to return to home.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleDialogClose();
                router.push("/");
              }}
            >
              Return home
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>;
  }
  return <>Invalid comic/panel</>;
}
