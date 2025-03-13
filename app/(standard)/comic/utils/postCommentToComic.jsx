import { addDataWithAutoID } from "@/app/firestore/addData";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import getUserInfo from "./getUserInfo.jsx";

export default async function postCommentToComic({ ...newComment }) {
  // const comicRef = doc(db, "comics", comicId);
  // const userRef = doc(db, "users", authUser.uid);
  // const userInfo = await getUserInfo(authUser);

  const { result } = await addDataWithAutoID("comments", {
    ...newComment,
    commentPostedDate: serverTimestamp(),
  });

  const commentRef = doc(db, "comments", result.id);

  // Fetch the full comment data
  const docSnap = await getDoc(commentRef);
  if (!docSnap.exists()) {
    throw new Error("Failed to retrieve the posted comment data.");
  }

  const commentData = { id: result.id, ...docSnap.data() };
  console.log(`Comment ${commentData.id} posted to comments collection.`);
  return commentData;
}
