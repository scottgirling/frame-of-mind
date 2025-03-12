import { db } from "@/lib/firebase";
import {
  doc,
  query,
  getDocs,
  collection,
  where,
  orderBy,
} from "firebase/firestore";

export default async function fetchCompletedComics() {
  const comicDataQuery = query(
    collection(db, "comics"),
    where("isCompleted", "==", true),
    where("isPublic", "==", true),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(comicDataQuery);
  const comics = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(comics, "<========HERE");

  return comics;
}
