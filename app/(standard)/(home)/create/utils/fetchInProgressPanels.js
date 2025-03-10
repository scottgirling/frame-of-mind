import { db } from "@/lib/firebase";
import { doc, query, getDocs, collection, where } from "firebase/firestore";

export default async function fetchInProgressPanels(uid, isSolo) {
  const userRef = doc(db, "users", uid);
  const q = query(
    collection(db, "panels"),
    where("userRef", "==", userRef),
    where("isSolo", "==", isSolo),
    where("isInProgress", "==", true)
  );
  const querySnapshot = await getDocs(q);
  const panels = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // console.log(panels, "<-- in progress panels");

  return panels;
}
