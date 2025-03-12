"use client";
import { use, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { useMediaQuery } from "react-responsive";
import CommentsList from "../components/CommentsList";
import ComicGrid from "../components/ComicGrid";
import CommentForm from "../components/CommentForm";
import fetchCommentsForComic from "../utils/fetchCommentsForComic";
import getData from "@/app/firestore/getData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import postCommentToComic from "../utils/postCommentToComic";
import getUserInfo from "../utils/getUserInfo";
import { Trash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function ComicPage({ params }) {
  const comicId = use(params).id;
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 600px)",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authUser] = useAuthState(auth);
  const [userRef, setUserRef] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const comicRef = doc(db, "comics", comicId);
  const [comicInfo, setComicInfo] = useState(null);
  const [isUsersComic, setIsUsersComic] = useState(false);
  const [comicIsPublic, setComicIsPublic] = useState(false);

  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    if (authUser && !userInfo) {
      const userRef = doc(db, "users", authUser.uid);
      setUserRef(userRef);

      async function fetchUser(authUser) {
        const userInfo = await getUserInfo(authUser);
        setUserInfo(userInfo);
      }
      fetchUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchComicsAndComments(comicId, comicRef) {
      try {
        setLoading(true);

        const comicInfo = (await getData("comics", comicId)).result.data();
        setComicInfo(comicInfo);
        setComicIsPublic(comicInfo.isPublic);

        const comments = await fetchCommentsForComic(comicRef);
        setComments(comments);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    }
    fetchComicsAndComments(comicId, comicRef);
  }, [comicId]);

  useEffect(() => {
    if (comicInfo && userRef && comicInfo.createdBy) {
      if (comicInfo.createdBy.id === userRef.id) {
        setIsUsersComic(true);
      } else {
        setIsUsersComic(false);
      }
    }
  }, [comicInfo, userRef]);

  async function handlePrivacySetting() {
    if (!isUsersComic) return;

    const newIsPublic = !comicIsPublic;
    setComicIsPublic(newIsPublic);

    await updateDoc(comicRef, {
      isPublic: newIsPublic,
    });
  }

  async function handlePostComment(event, commentBody) {
    try {
      event.preventDefault();
      setIsPosting(true);

      if (!userRef || !userInfo) setLoading(true);

      const newComment = {
        userRef,
        comicRef,
        displayName: userInfo.displayName,
        avatarUrl: userInfo.avatarUrl,
        commentPostedDate: "Posting in progress...",
        likes: 0,
        commentBody,
      };
      // Could alternatively use commentPostedDate: Date.now(),

      setComments([
        {
          ...newComment,
          isOptimistic: true,
        },
        ...comments,
      ]);

      const postedComment = await postCommentToComic({ ...newComment });
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.isOptimistic && comment.commentBody === newComment.commentBody
            ? { ...postedComment, isOptimistic: false }
            : comment
        );
      });
      setIsPosting(false);
    } catch (error) {
      // Comment failed: remove optimistically rendered comment from the comments state
      setComments(comments.filter((comment) => !comment.isOptimistic));
      console.log(error);
      setError(error);
      setIsPosting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.log(error);
      setError("Error deleting comment");
    }
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  async function handleDeleteComic() {
    try {
      await deleteDoc(comicRef);
      router.push("/");
      // Notify user of deletion and redirect to my comics?
    } catch (error) {
      console.log(error);
      setError("Error deleting comic");
    }
    setOpenDialog(false);
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading comic.</Typography>;
  if (!comicInfo) return <Typography>No comic data found.</Typography>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 2,
          position: "relative",
        }}
      >
        {isUsersComic && (
          <Button
            onClick={handleOpenDialog}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              fontSize: "1.7rem",
            }}
          >
            <Trash />
          </Button>
        )}
        <Typography
          variant="h1"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontSize: "2rem",
          }}
        >
          {comicInfo?.comicTheme}
        </Typography>

        {comicInfo.isSolo && isUsersComic && (
          <Box
            variant="body1"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              position: "absolute",
              right: 0,
            }}
          >
            <Typography>Private</Typography>
            <Switch
              checked={comicIsPublic}
              onClick={() => {
                handlePrivacySetting();
              }}
            />
            <Typography>Public</Typography>
          </Box>
        )}
      </Box>
      <ComicGrid panels={comicInfo?.panels} />
      <hr />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Comments:
      </Typography>
      <CommentForm handlePostComment={handlePostComment} />
      <CommentsList
        comments={comments}
        handleDeleteComment={handleDeleteComment}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Comic?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comic? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteComic}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
