"use client";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
/** @jsxImportSource @emotion/react */
import {
  Avatar,
  Box,
  IconButton,
  keyframes,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Comment({
  comment: {
    displayName,
    avatarUrl,
    commentBody,
    commentPostedDate,
    likes,
    isOptimistic,
  },
}) {
  const [dateTime, setDateTime] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  const [hasBeenLiked, setHasBeenLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(likes);

  useEffect(() => {
    // prevent hydration errors by handling date formatting in a useEffect
    if (
      !isOptimistic &&
      commentPostedDate &&
      typeof commentPostedDate.toDate === "function"
    ) {
      const date = commentPostedDate.toDate();
      setDateTime(date.toISOString().split("Z")[0]);
      setTimestamp(
        date.toLocaleString("en-GB", {
          timeZone: "UTC",
          hour12: true,
        })
      );
    }
  }, [commentPostedDate, isOptimistic]);

  const handleLikeClick = () => {
    setHasBeenLiked((prev) => !prev);

    setCommentLikes((prevLikes) =>
      hasBeenLiked ? prevLikes - 1 : prevLikes + 1
    );
  };

  // const pulse = keyframes`0% {
  //   opacity: 0.8;
  // }
  // 50% {
  //   opacity: 0.5;
  // }
  // 100% {
  //   opacity: 0.8;
  // }`;

  return (
    <Box sx={{ my: 1 }}>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          mb: 1.5,
          mt: 1,
        }}
      >
        <Avatar
          src={
            typeof avatarUrl === "string" && avatarUrl.length > 0
              ? avatarUrl
              : undefined
          }
          sx={{
            border: 2,
            borderColor: "primary.emphasis",
            bgcolor: "primary.light",
            color: "primary.main",
          }}
        >
          {typeof avatarUrl === "string" && avatarUrl.length === 0
            ? displayName[0]
            : null}
        </Avatar>
        <Box>
          {/* <Link href={"/profile/" + uid} underline="hover"> */}
          <Typography variant="body1">{displayName || "Unknown"}</Typography>
          {/* </Link> */}

          {isOptimistic ? (
            <Typography variant="body2">Posting in progress...</Typography>
          ) : (
            <Typography variant="body2" component="time" dateTime={dateTime}>
              {timestamp}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        component={"section"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.light",
            borderRadius: 2,
            flexGrow: 1,
            p: 2,
            mr: 2,
          }}
        >
          <Typography variant="body1">{commentBody}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 0.5,
            mr: 1,
          }}
        >
          <IconButton onClick={handleLikeClick}>
            {hasBeenLiked ? (
              <Favorite sx={{ color: "red" }} />
            ) : (
              <FavoriteBorder sx={{ color: "gray" }} />
            )}
          </IconButton>
          <Typography variant="body2">Likes: {commentLikes}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
