import { addDataWithAutoID } from "@/app/firestore/addData";
import { db } from "@/lib/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import addPanelToComic from "./addPanelToComic.js";
import { comicTheme } from "./inspireMeGenerator.js";

export default async function createNewComic(uid, isSolo) {
  const userRef = doc(db, "users", uid);
  const { result } = await addDataWithAutoID("comics", {
    comicLikes: 0,
    comicTheme,
    completedAt: null,
    createdAt: serverTimestamp(),
    createdBy: userRef,
    isCompleted: false,
    isPublic: false,
    isSolo: isSolo,
    isInProgress: true,
    panels: [],
  });
  const comicId = result.id;
  const panelId = await addPanelToComic(uid, result.id, isSolo);
  return [comicId, panelId];
}
