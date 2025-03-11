import { addDataWithAutoID } from "@/app/firestore/addData";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import getUserInfo from "./getUserInfo.jsx";

export default async function postCommentToComic({
  authUser,
  comicId,
  ...newComment
}) {
  const comicRef = doc(db, "comics", comicId);
  const userRef = doc(db, "users", authUser.uid);
  const userInfo = await getUserInfo(authUser);

  const { result } = await addDataWithAutoID("comments", {
    userRef: userRef,
    comicRef: comicRef,
    displayName: newComment.displayName,
    avatarUrl: userInfo.avatarUrl,
    commentBody: newComment.commentBody,
    commentPostedDate: serverTimestamp(),
    likes: 0,
  });

  const commentId = result.id;
  console.log(`Comment ${commentId} posted to comments collection.`);
  return commentId;
}
