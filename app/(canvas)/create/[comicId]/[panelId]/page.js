"use client";
/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Canvas from "@/app/(canvas)/components/canvas";
import TopBar from "@/app/components/TopBar";
import Avatar from "@/app/components/Avatar";
import {
  Avatar as RoundIconButton,
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
  css,
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
import getData from "@/app/firestore/getData";
import { useParams, useRouter } from "next/navigation";
import { FloppyDiskBack, Trash } from "@phosphor-icons/react/dist/ssr";
import PaperBox from "@/app/components/PaperBox";

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

  const refCanvas = useRef(null);
  const [rawDrawingData, setRawDrawingData] = useState([]);
  const [drawingDataUrl, setDrawingDataUrl] = useState(null);
  const [panelCaption, setPanelCaption] = useState("");
  const [tempPanelCaption, setTempPanelCaption] = useState("");
  const [isPanelCaptionSubmitted, setIsPanelCaptionSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 140;

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

  async function handleSubmit(canvas) {
    try {
      if (!comicId || !panelId) return;

      const rawDrawingDataString = JSON.stringify(rawDrawingData);

      const dataUrl = canvas.toDataURL();

      await updateDoc(panelRef, {
        rawDrawingDataString,
        drawingDataUrl: dataUrl,
        isInProgress: false,
        panelCaption,
      });

      await updateDoc(comicRef, {
        isInProgress: false,
      });

      const userData = (await getData("users", authUser.uid)).result.data();
      const comicSnapshot = await getDoc(comicRef);
      if (comicSnapshot.data().panels.length === 8) {
        await updateDoc(comicRef, {
          isCompleted: true,
          completedAt: serverTimestamp(),
        });
        await updateDoc(userRef, {
          myComics: arrayUnion(comicRef),
        });
      }
      const now = Timestamp.now().toMillis();
      const today = new Date(now);
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const lastContributedMillis = userData.hasOwnProperty("lastContributedAt")
        ? userData.lastContributedAt.toMillis()
        : 0;
      const lastContributed = new Date(lastContributedMillis);

      const contributedToday =
        lastContributed.getDate() === today.getDate() &&
        lastContributed.getMonth() === today.getMonth() &&
        lastContributed.getFullYear() === today.getFullYear();

      const contributedYesterday =
        lastContributed.getDate() === yesterday.getDate() &&
        lastContributed.getMonth() === yesterday.getMonth() &&
        lastContributed.getFullYear() === yesterday.getFullYear();

      const currentDayStreak = userData.dayStreak ?? 0;
      if (!contributedToday) {
        if (contributedYesterday) {
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

      await updateDoc(userRef, {
        lastContributedAt: serverTimestamp(),
      });
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
                sx={{
                  ml: "auto",
                  mr: 2,
                  bgcolor: "green.main",
                  color: "green.contrastText",
                }}
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

        <PaperBox
          colour="light"
          variant="main"
          borderSize={15}
          margin={{ m: "auto" }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 5,
          }}
        >
          <Box
            sx={{
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
              refCanvas={refCanvas}
              fileButtons={
                <>
                  <RoundIconButton
                    sx={{
                      mx: 0.5,
                      bgcolor: "primary.light",
                      color: "primary.main",
                    }}
                    css={css`
                      :hover {
                        opacity: 0.8;
                        cursor: pointer;
                      }
                    `}
                    variant="outlined"
                    onClick={() => {
                      setDialogAction("discard");
                      setOpenCheckDialog(true);
                    }}
                  >
                    <Trash />
                  </RoundIconButton>
                  <RoundIconButton
                    sx={{
                      mx: 0.5,
                      bgcolor: "primary.light",
                      color: "primary.main",
                    }}
                    css={css`
                      :hover {
                        opacity: 0.8;
                        cursor: pointer;
                      }
                    `}
                    variant="outlined"
                    onClick={() => {
                      handleSave();
                    }}
                  >
                    <FloppyDiskBack />
                  </RoundIconButton>
                </>
              }
              setPanelCaption={setPanelCaption}
              parsedDrawingData={
                panelInfo.rawDrawingDataString &&
                panelInfo.rawDrawingDataString.length > 0
                  ? JSON.parse(panelInfo.rawDrawingDataString)
                  : []
              }
            />
            <Box component="form" sx={{ m: "auto" }}>
              {isPanelCaptionSubmitted ? (
                <>
                  <Typography
                    sx={{ textAlign: "center", m: "auto", ml: 5, mr: 5 }}
                  >
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
                    helperText={`Add a description of what's happening in your panel. ${
                      charLimit - charCount
                    } characters remaining.`}
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
                    {comicInfo.panels.length === 1
                      ? "Warning! This is the first panel of the comic, discarding this panel will delete the whole comic."
                      : null}
                    <br />
                    Are you sure you want to discard this panel? This action
                    cannot be undone .
                  </Typography>
                )}
                {dialogAction === "submit" && (
                  <Typography variant="body1">
                    Are you ready to submit your panel? Once submitted, you
                    won't be able to make further changes.
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
                      handleSubmit(refCanvas.current);
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
        </PaperBox>
      </>
    );
  }
  return <>Invalid comic/panel</>;
}
