import { addDataWithAutoID } from "@/app/firestore/addData";
import { db } from "@/lib/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import addPanelToComic from "./addPanelToComic";

export default async function createNewComic(uid) {
  const userRef = doc(db, "users", uid);
  const { result } = await addDataWithAutoID("comics", {
    comicLikes: 0,
    comicTheme: "", // Link to random word API
    completedAt: "",
    createdAt: serverTimestamp(),
    createdBy: userRef,
    isCompleted: false,
    isPublic: false,
    isSolo: true,
    panels: [],
  });
  console.log(result.id, "<-- this is the new comic id");

  await addPanelToComic(uid, result.id);
}
