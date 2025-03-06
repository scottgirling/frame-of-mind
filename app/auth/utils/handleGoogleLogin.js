import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default async function handleGoogleLogIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.providerData[0].photoURL ?? "",
      createdAt: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    });
  } catch (error) {
    console.log(error);
  }
}
