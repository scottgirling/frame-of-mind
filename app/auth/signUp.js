import { auth } from "@/lib/firebase";
import addData from "../firestore/addData";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default async function signUp(displayName, email, password, setLoading) {
  try {
    setLoading(true);
    const newUser = await createUserWithEmailAndPassword(auth, email, password);

    await newUser.user.reload();
    const updatedUser = auth.currentUser;

    const { result } = await addData("users", updatedUser.uid, {
      displayName: displayName,
      email: updatedUser.email,
      password: updatedUser.reloadUserInfo.passwordHash,
      avatarUrl: "",
      dayStreak: 0,
      weekStreak: 0,
      userBio: "",
      points: 0,
      createdAt: newUser.user.metadata.creationTime,
      lastSignInTime: newUser.user.metadata.lastSignInTime,
      myComics: [],
    });
    await updateProfile(updatedUser, { displayName });
    setLoading(false);
    return result;
  } catch (error) {
    console.log(error);
  }
}
