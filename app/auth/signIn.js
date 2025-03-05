import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import addData from "../firestore/addData";
import getData from "../firestore/getData";

export default async function signIn(email, password, setLoading) {
  setLoading(true);
  let result = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);

    const uid = result.user.uid;
    const lastSignInTime = result.user.metadata.lastSignInTime;

    const currentUserData = (await getData("users", uid)).result.data();

    await updateProfile(auth.currentUser, {
      displayName: currentUserData.displayName,
    });

    await addData("users", uid, { lastSignInTime });
    setLoading(false);
  } catch (e) {}

  return { result };
}
