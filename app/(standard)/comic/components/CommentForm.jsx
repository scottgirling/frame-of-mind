import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function CommentForm({ handlePostComment }) {
  const [tempCommentBody, setTempCommentBody] = useState("");
  const [charCount, setCharCount] = useState(0);
  const charLimit = 140;
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    if (tempCommentBody.trim() === "") {
      setError("Please write a comment!");
      return;
    }

    await handlePostComment(event, tempCommentBody);
    setTempCommentBody("");
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mt: 1.5,
          mb: 3,
        }}
      >
        <TextField
          id="outlined-multiline-flexible"
          label="Post a comment here..."
          slotProps={{ htmlInput: { maxLength: 140 } }}
          multiline
          variant="outlined"
          helperText={`${charLimit - charCount} characters remaining.`}
          value={tempCommentBody}
          sx={{
            flexGrow: 1,
          }}
          onChange={(event) => {
            setError(null);
            setTempCommentBody(event.target.value);
            setCharCount(event.target.value.length);
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Button
            variant="outlined"
            sx={{ mb: 2.8, ml: 1 }}
            onClick={() => {
              setTempCommentBody("");
              setCharCount(0);
              setError(null);
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            sx={{ mb: 2.8, ml: 1 }}
            onClick={handleSubmit}
          >
            Post comment
          </Button>
        </Box>
      </Box>
      {error && (
        <Typography sx={{ color: "red", mb: 2 }}>Error: {error}</Typography>
      )}
    </>
  );
}
