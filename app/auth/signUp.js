import { auth } from "@/lib/firebase";
import addData from "../firestore/addData";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUp(email, displayName, password) {
  try {
    const newUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { result } = await addData("users", newUser.user.uid, {
      displayName,
      email: newUser.user.email,
      password: newUser.user.reloadUserInfo.passwordHash,
    });
    return result;
  } catch (e) {
    console.log(e);
  }
}