import { Box } from "@mui/material";
import Comment from "./Comment";

export default function CommentsList({ comments }) {
  return (
    <Box sx={{ mb: 5 }}>
      {comments.map((comment, i) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Box>
  );
}
