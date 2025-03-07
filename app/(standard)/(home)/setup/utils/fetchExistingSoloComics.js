import { db } from "@/lib/firebase";
import { doc, query, getDocs, collection, where } from "firebase/firestore";

export default async function fetchExistingSoloComics(
  uid,
  setExistingSoloComics,
  setLoading
) {
  setLoading(true);
  const userRef = doc(db, "users", uid);
  const q = query(
    collection(db, "comics"),
    where("createdBy", "==", userRef),
    where("isSolo", "==", true),
    where("isCompleted", "==", false)
  );
  const querySnapshot = await getDocs(q);
  const existingSoloComics = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log(existingSoloComics);
  setExistingSoloComics(existingSoloComics);
  setLoading(false);
}
