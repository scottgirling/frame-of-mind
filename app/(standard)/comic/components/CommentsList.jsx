import { Box } from "@mui/material";
import Comment from "./Comment";

export default function CommentsList({ comments, handleDeleteComment }) {
  return (
    <Box sx={{ mb: 5 }}>
      {comments.map((comment, i) => (
        <Comment
          key={i}
          comment={comment}
          commentId={comment.id}
          handleDeleteComment={handleDeleteComment}
        />
      ))}
    </Box>
  );
}
