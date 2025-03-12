"use client";
import { use, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import CommentsList from "../components/CommentsList";
import ComicGrid from "../components/ComicGrid";
import CommentForm from "../components/CommentForm";
import fetchCommentsForComic from "../utils/fetchCommentsForComic";
import getData from "@/app/firestore/getData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import postCommentToComic from "../utils/postCommentToComic";

export default function ComicPage({ params }) {
  const comicId = use(params).id;
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 600px)",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authUser] = useAuthState(auth);
  const [userRef, setUserRef] = useState(null);

  const comicRef = doc(db, "comics", comicId);
  const [comicInfo, setComicInfo] = useState(null);
  const [isUsersComic, setIsUsersComic] = useState(false);
  const [comicIsPublic, setComicIsPublic] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUserRef(doc(db, "users", authUser.uid));
    }
  }, [authUser]);

  useEffect(() => {
    async function fetchComicsAndComments(comicId, comicRef) {
      try {
        setLoading(true);

        const comicInfo = (await getData("comics", comicId)).result.data();
        setComicInfo(comicInfo);

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

    // if (comicInfo.userRef === userRef) {
    //   setIsUsersComic(true);
    // }
  }, [comicId]);

  async function handlePrivacySetting() {
    setComicIsPublic(!comicIsPublic);

    await updateDoc(comicRef, {
      isPublic: comicIsPublic,
    });
  }

  async function handlePostComment(event) {
    try {
      event.preventDefault();
      setIsPosting(true);

      const displayName = authUser.displayName;
      const uid = authUser.uid;
      // const avatarUrl = authUser.avatarUrl;

      // commentBody to be set in state while typing in the comment form

      const newComment = {
        uid,
        displayName,
        avatarUrl,
        commentBody,
      };

      // We also want to do some sort of posting state, the new comment should be optimistically rendered but greyed out or something until it's confirmed to have gone through successfully and we should lock the posting function until that's completed so they don't double submit.

      // to optimistically render the new comment we can immediately add it to comments array
      // and because this is just to display feedback for the user, we can use their local time instead of the server time
      // also adding the isOptimistic flag so we can distinguish it from comments fetched from the database
      setComments([
        {
          ...newComment,
          commentPostedDate: Date.now(),
          isOptimistic: true,
        },
        ...comments,
      ]);

      await postCommentToComic({ authUser, comicId, ...newComment });

      setIsPosting(false);
    } catch (error) {
      // Comment failed: remove optimistically rendered comment from the comments state
      setComments(comments.filter((comment) => !comment.isOptimistic));
      console.log(error);
      setError(error);
      setIsPosting(false);
    }
  }

  // Function to handle comment form

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading comic.</Typography>;
  if (!comicInfo) return <Typography>No comic data found.</Typography>;

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: "2rem",
          mb: 2,
        }}
      >
        {comicInfo?.comicTheme}
      </Typography>
      <ComicGrid panels={comicInfo?.panels} />
      <hr />
      <CommentForm />
      <CommentsList />
    </>
  );
}
