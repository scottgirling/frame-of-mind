import { db } from "@/lib/firebase";
import {
  doc,
  query,
  getDocs,
  collection,
  where,
  orderBy,
} from "firebase/firestore";

export default async function fetchCommentsForComic(comicRef) {
  // Return comments related to the comic passed in
  const q = query(
    collection(db, "comments"),
    where("comicRef", "==", comicRef),
    orderBy("commentPostedDate", "desc")
  );
  const querySnapshot = await getDocs(q);
  const comments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return comments;
}
