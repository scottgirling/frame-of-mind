import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function getUserInfo(authUser) {
  try {
    const userRef = doc(db, "users", authUser.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
