import { db } from "@/lib/firebase";
import { doc, query, getDocs, collection, where } from "firebase/firestore";

export default async function fetchExistingComics(
  uid,
  setExistingComics,
  setLoading,
  isSolo
) {
  setLoading(true);
  const userRef = doc(db, "users", uid);
  const q = query(
    collection(db, "comics"),
    where("createdBy", "==", userRef),
    where("isSolo", "==", isSolo),
    where("isCompleted", "==", false).orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  const existingComics = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(existingComics);
  setExistingComics(existingComics);
  setLoading(false);
}
