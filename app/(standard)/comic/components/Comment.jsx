"use client";
/** @jsxImportSource @emotion/react */
import { Avatar, Box, css, keyframes, Link } from "@mui/material";
import { useEffect, useState } from "react";

export default function Comment({
  commentData: {
    uid,
    displayName,
    avatarUrl,
    commentBody,
    commentPostedDate,
    isOptimistic,
  },
}) {
  const [dateTime, setDateTime] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    // prevent hydration errors by handling date formatting in a useEffect
    const date = new Date(commentPostedDate);
    setDateTime(date.toISOString().split("Z")[0]);
    setTimestamp(
      date.toLocaleString("en-GB", {
        timeZone: "UTC",
        hour12: true,
      })
    );
  }, []);

  const pulse = keyframes`0% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }`;

  return (
    <>
      <Box
        sx={{ my: 1 }}
        component={"article"}
        css={css`
          animation: 2.5s ease-in-out 0.5s infinite ${pulse};
          filter: grayscale(0.3);
        `}
      >
        <header style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <Avatar
            src={avatarUrl.length > 0 ? avatarUrl : undefined}
            sx={{
              border: 2,
              borderColor: "primary.emphasis",
              bgcolor: "primary.light",
              color: "primary.main",
            }}
          >
            {avatarUrl.length === 0 ? displayName[0] : null}
          </Avatar>
          <div>
            <Link href={"/profile/" + uid} underline="hover">
              {displayName}
            </Link>
            <br />
            <time dateTime={dateTime}>{timestamp}</time>
          </div>
        </header>
        <Box
          component={"section"}
          sx={{ bgcolor: "primary.light", borderRadius: 2, p: 2, mt: 1 }}
        >
          {commentBody}
        </Box>
      </Box>
      <Box component={"article"} sx={{ my: 1 }}>
        <header style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <Avatar
            src={avatarUrl.length > 0 ? avatarUrl : undefined}
            sx={{
              border: 2,
              borderColor: "primary.emphasis",
              bgcolor: "primary.light",
              color: "primary.main",
            }}
          >
            {avatarUrl.length === 0 ? displayName[0] : null}
          </Avatar>
          <div>
            <Link href={"/profile/" + uid} underline="hover">
              {displayName}
            </Link>
            <br />
            <time dateTime={dateTime}>{timestamp}</time>
          </div>
        </header>
        <Box
          component={"section"}
          sx={{ bgcolor: "primary.light", borderRadius: 2, p: 2, mt: 1 }}
        >
          {commentBody}
        </Box>
      </Box>
    </>
  );
}
