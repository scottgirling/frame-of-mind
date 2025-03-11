"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Canvas from "@/app/(canvas)/components/canvas";
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
  CircularProgress,
} from "@mui/material";
import { auth, db } from "@/lib/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import deletePanel from "@/app/(standard)/(home)/create/utils/deletePanel";
import { inspireMeGenerator } from "@/app/(standard)/(home)/create/utils/inspireMeGenerator";
import getData from "@/app/firestore/getData";
import { useParams, useRouter } from "next/navigation";
import { FloppyDiskBack, Trash } from "@phosphor-icons/react/dist/ssr";

export default function Create() {
  const { comicId, panelId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [authUser] = useAuthState(auth);
  const [userRef, setUserRef] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [comicRef, setComicRef] = useState(null);
  const [panelRef, setPanelRef] = useState(null);
  const [comicInfo, setComicInfo] = useState(null);
  const [comicTheme, setComicTheme] = useState(null);
  const [panelInfo, setPanelInfo] = useState(null);
  const [showPreviousPanels, setShowPreviousPanels] = useState(false);

  const [validComic, setValidComic] = useState(null);
  const [validPanel, setValidPanel] = useState(null);

  const [rawDrawingData, setRawDrawingData] = useState([]);
  const [panelCaption, setPanelCaption] = useState("");
  const [tempPanelCaption, setTempPanelCaption] = useState("");
  const [isPanelCaptionSubmitted, setIsPanelCaptionSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 140;
  const [inspireMe, setInspireMe] = useState("");

  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useEffect(() => {
    currentComicTheme();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUserRef(doc(db, "users", authUser.uid));
    }
  }, [authUser]);

  useEffect(() => {
    setLoading(true);
    if (comicId && panelId) {
      const comicRef = doc(db, "comics", comicId);
      const panelRef = doc(db, "panels", panelId);
      setPanelRef(panelRef);
      setComicRef(comicRef);
    }
  }, [comicId, panelId]);
  useEffect(() => {
    async function checkIds() {
      try {
        if (comicRef && panelRef) {
          const comicSnapshot = await getDoc(comicRef);
          setValidComic(comicSnapshot._document ? true : false);
          const panelSnapshot = await getDoc(panelRef);
          setValidPanel(panelSnapshot._document ? true : false);
          const userSnapshot = await getDoc(userRef);
          setPanelInfo(panelSnapshot.data());
          setComicInfo(comicSnapshot.data());
          setUserInfo(userSnapshot.data());
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    }
    checkIds();
  }, [comicRef, panelRef]);

  async function handleDiscard() {
    if (!comicId || !panelId) return;

    await deletePanel(authUser.uid, comicId, panelId);

    setDialogAction("discard");
    setOpenConfirmationDialog(true);
  }

  async function handleSave() {
    try {
      if (!comicId || !panelId) return;

      const rawDrawingDataString = JSON.stringify(rawDrawingData);

      await updateDoc(panelRef, {
        rawDrawingDataString,
        panelCaption,
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

      await updateDoc(panelRef, {
        rawDrawingDataString,
        isInProgress: false,
        panelCaption,
      });

      await updateDoc(comicRef, {
        isInProgress: false,
      });

      const comicSnapshot = await getDoc(comicRef);
      if (comicSnapshot.data().panels.length === 8) {
        await updateDoc(comicRef, {
          isCompleted: true,
          completedAt: serverTimestamp(),
        });
        await updateDoc(userRef, {
          myComics: arrayUnion(comicRef),
        });

        await updateDoc(userRef, {
          lastContributedAt: serverTimestamp(),
        });

        const now = Timestamp.now().toMillis();
        const yesterdayDate = now - 24 * 60 * 60 * 1000;
        const today = new Date(now).getDate();
        const yesterday = new Date(yesterdayDate).getDate();
        const lastContributedMillis = userInfo.lastContributedAt.toMillis();
        const currentDayStreak = userInfo.dayStreak;
        if (
          now - lastContributedMillis < 48 * 60 * 60 * 1000 &&
          today === yesterday + 1
        ) {
          // Add 1 to dailyStreak if the next day
          await updateDoc(userRef, {
            dayStreak: increment(1),
          });
        } else {
          // Otherwise, start new streak
          await updateDoc(userRef, {
            dayStreak: 1,
            weekStreak: 0,
          });
        }

        if (currentDayStreak === 6) {
          await updateDoc(userRef, {
            weekStreak: increment(1),
          });
        }
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
    const comicTheme = (await getData("comics", comicId)).result.data()
      .comicTheme;
    setComicTheme(comicTheme);
  }

  if (loading) return <CircularProgress />;

  if (validComic && validPanel) {
    return (
      <>
        <TopBar
          components={
            <>
              <Typography variant="h2" sx={{ fontSize: "1.3rem", ml: "auto" }}>
                Comic theme: {comicTheme}
              </Typography>
              <Button
                sx={{ ml: "auto", mr: 0.5 }}
                variant="outlined"
                onClick={() => {
                  setDialogAction("discard");
                  setOpenCheckDialog(true);
                }}
              >
                <Trash />
              </Button>
              <Button
                sx={{ ml: 0.5, mr: 0.5 }}
                variant="outlined"
                onClick={() => {
                  handleSave();
                }}
              >
                <FloppyDiskBack />
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
        <Box
          sx={{
            mt: "1.25rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body1">
            You are drawing panel {comicInfo.panels.length}
          </Typography>
          {comicInfo.panels.length > 1 && (
            <Button
              variant="contained"
              onClick={() => setShowPreviousPanels(true)}
            >
              Show previous panels?
            </Button>
          )}
          {showPreviousPanels && (
            <Box>
              {/* To do: Set up a PreviousPanels component which shows the images of each panel which can be enlarged onClick/hover? */}
              {/* <PreviousPanels comicInfo={comicInfo} /> */}
            </Box>
          )}
        </Box>

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
          <Canvas
            setRawDrawingData={setRawDrawingData}
            setPanelCaption={setPanelCaption}
            panelInfo={panelInfo}
            parsedDrawingData={
              panelInfo.rawDrawingDataString &&
              panelInfo.rawDrawingDataString.length > 0
                ? JSON.parse(panelInfo.rawDrawingDataString)
                : []
            }
          />
          <Box component="form" sx={{ m: "auto", mb: 5 }}>
            {isPanelCaptionSubmitted ? (
              <>
                <Typography sx={{ textAlign: "center", m: "auto", ml: 5, mr: 5 }}>
                  Panel Caption: {panelCaption}
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="outlined"
                    sx={{ width: 160, m: "auto", mt: 2, mr: 1 }}
                    onClick={() => {
                      setIsPanelCaptionSubmitted(false);
                    }}
                  >
                    Edit Caption
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ width: 160, m: "auto", mt: 2, ml: 1 }}
                    onClick={() => {
                      setIsPanelCaptionSubmitted(false);
                      setPanelCaption("");
                      setTempPanelCaption("");
                      setCharCount(0);
                    }}
                  >
                    Remove Caption
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Panel Caption"
                  slotProps={{ htmlInput: { maxLength: 140 } }}
                  multiline
                  variant="outlined"
                  helperText={`Add a description of what's happening in your panel. ${charLimit - charCount} characters remaining.`}
                  value={tempPanelCaption}
                  onChange={(event) => {
                    setTempPanelCaption(event.target.value);
                    setCharCount(event.target.value.length);
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ m: 1.25 }}
                  onClick={() => {
                    setIsPanelCaptionSubmitted(true);
                    setPanelCaption(tempPanelCaption);
                  }}
                >
                  Save Caption
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box>
          <Dialog open={openCheckDialog} onClose={handleDialogClose}>
            <DialogTitle>
              {dialogAction === "discard" && "Discard Panel"}
              {dialogAction === "submit" && "Submit Panel"}
            </DialogTitle>
            <DialogContent>
              {dialogAction === "discard" && (
                <Typography variant="body1">
                  Are you sure you want to discard this panel? This action
                  cannot be undone.
                </Typography>
              )}
              {dialogAction === "submit" && (
                <Typography variant="body1">
                  Are you ready to submit your panel? Once submitted, you won't
                  be able to make further changes.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              {dialogAction === "discard" && (
                <Button
                  onClick={() => {
                    setOpenCheckDialog(false);
                    handleDiscard();
                  }}
                >
                  Discard
                </Button>
              )}
              {dialogAction === "submit" && (
                <Button
                  onClick={() => {
                    setOpenCheckDialog(false);
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
        <Box>
          <Dialog
            disableEscapeKeyDown
            open={openConfirmationDialog}
            onClose={(event, reason) => {
              if (reason !== "backdropClick") {
                handleDialogClose();
              } else return;
            }}
          >
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
      </>
    );
  }
  return <>Invalid comic/panel</>;
}
