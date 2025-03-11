"use client";
import { use, useEffect, useState } from "react";
import CommentsList from "../components/CommentsList";
import { Box } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import ComicGrid from "../components/ComicGrid";

export default function ComicPage({ params }) {
  const comicID = use(params).id;
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 600px)",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comicData, setComicData] = useState(null);

  const [isUsersComic, setIsUsersComic] = useState(false);
  const [comicIsPrivate, setComicIsPrivate] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchData = async (comicID) => {
      try {
        setLoading(true);

        // Not sure on the exact implementation of this here, so this is just a placeholder suggestion

        // fetchedComicData = await // >fetch comic data function here, e.g. fetchComicData(comicID)< //
        // setComicData(fetchedComicData)

        // fetchedCommentsData = await // >fetch comic data function here, e.g. fetchCommentsData(fetchedComicData.commentsRef) //
        // setComments(fetchedCommentsData)

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };
    fetchData(comicID);

    // logic here to check if this comic belong's to the current user and set isUsersComic state, to toggle the visibility of the privacy button
  }, [comicID]);

  function handlePrivacySetting() {
    setComicIsPrivate(!comicIsPrivate);
    // update database with the new privacy state
  }

  async function handlePostComment(event) {
    try {
      event.preventDefault();
      setIsPosting(true);

      // get these from the logged in user
      const displayName = "";
      const uid = "";
      const avatarUrl = "";

      // commentBody to be set in state while typing in the comment form

      const newComment = {
        uid,
        displayName,
        avatarUrl,
        commentBody,
      };

      // We also want to do some sort of posting state, the new comment should be like optimistically rendered but greyed out or something until it's confirmed to have gone through successfully and we should lock the posting function until that's completed so they don't double submit.

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

      // lastly we update the database here, but we set the commentPostedDate to be using the server's time first
      // await postCommentToDatabase({...newComment, commentPostedDate: >firebase date stuff here<})
      setIsPosting(false);
    } catch (error) {
      // this means the comment failed, so let's remove the optimistically rendered comment from the comments state
      setComments(comments.filter((comment) => !comment.isOptimistic));
      console.log(error);
      setError(error);
      setIsPosting(false);
    }
  }

  return (
    <>
      <ComicGrid />
      <hr />
      <CommentsList />
    </>
  );
}
