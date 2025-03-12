import { db } from "@/lib/firebase";
import {
  doc,
  query,
  getDocs,
  collection,
  where,
  orderBy,
} from "firebase/firestore";

export default async function fetchMyCompletedComics(authUser) {
  const userRef = doc(db, "users", authUser.uid);

  const comicDataQuery = query(
    collection(db, "comics"),
    where("isCompleted", "==", true),
    where("createdBy", "==", userRef),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(comicDataQuery);
  const comics = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return comics;
}
