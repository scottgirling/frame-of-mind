import { auth, db, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default async function handleGoogleLogIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userInfo = await getData("users", userRef);

    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.providerData[0].photoURL ?? "",
      dayStreak: userInfo.dayStreak ?? 0,
      weekStreak: userInfo.weekStreak ?? 0,
      userBio: userInfo.userBio ?? "",
      points: userInfo.points ?? 0,
      createdAt: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      myComics: userInfo.myComics ?? [],
    });
  } catch (error) {
    console.log(error);
  }
}
