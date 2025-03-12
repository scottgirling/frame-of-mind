"use client";
import { use, useEffect, useState } from "react";
import { Box, CircularProgress, Switch, Typography } from "@mui/material";
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
import getUserInfo from "../utils/getUserInfo";

export default function ComicPage({ params }) {
  const comicId = use(params).id;
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 600px)",
  });

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
  // const [commentBody, setCommentBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

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

    // if (comicInfo.createdBy === userRef) {
    //   setIsUsersComic(true);
    // }
  }, [comicId]);

  useEffect(() => {
    if (comicInfo && userRef && comicInfo.createdBy) {
      if (comicInfo.createdBy === userRef) {
        setIsUsersComic(true);
      } else {
        setIsUsersComic(false);
      }
    }
  }, [comicInfo, userRef]);

  async function handlePrivacySetting() {
    if (!isUsersComic) return;

    setComicIsPublic(!comicIsPublic);

    await updateDoc(comicRef, {
      isPublic: comicIsPublic,
    });
  }

  async function handlePostComment(event, commentBody) {
    try {
      event.preventDefault();
      setIsPosting(true);

      if (!userRef || !userInfo) setLoading(true);

      // NB: commentBody set in state by CommentForm component

      const newComment = {
        userRef,
        comicRef,
        displayName: userInfo.displayName,
        avatarUrl: userInfo.avatarUrl,
        commentPostedDate: "Posting in progress...",
        likes: 0,
        commentBody,
      };

      console.log("new comment:", newComment);

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

      // { ...comment, commentPostedDate: postedComment.commentPostedDate }

      setIsPosting(false);
    } catch (error) {
      // Comment failed: remove optimistically rendered comment from the comments state
      setComments(comments.filter((comment) => !comment.isOptimistic));
      console.log(error);
      setError(error);
      setIsPosting(false);
    }
  }

  console.log(comments);

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

        {comicInfo.isSolo && (
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
      <CommentsList comments={comments} />
    </>
  );
}
