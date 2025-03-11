import Comment from "./Comment";

export default function CommentsList({
  comments = [
    {
      uid: "123",
      displayName: "Harrie",
      avatarUrl: "",
      commentBody: "This is a dummy comment",
      commentPostedDate: Date.now(),
    },
  ],
}) {
  return (
    <>
      {comments.map((comment, i) => (
        <Comment key={i} commentData={comment} />
      ))}
    </>
  );
}
