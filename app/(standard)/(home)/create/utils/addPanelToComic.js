import { addDataWithAutoID } from "@/app/firestore/addData";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

export default async function addPanelToComic(uid, comicId, isSolo) {
  const comicRef = doc(db, "comics", comicId);
  const userRef = doc(db, "users", uid);
  const { result } = await addDataWithAutoID("panels", {
    audio: "",
    comicRef: comicRef,
    panelCaption: "",
    rawDrawingData: "",
    userRef: userRef,
    createdAt: serverTimestamp(),
    isInProgress: true,
    isSolo: isSolo,
  });
  console.log(result.id, "<-- this is the new panel id");

  const panelRef = doc(db, "panels", result.id);
  await updateDoc(comicRef, {
    isInProgress: true,
    panels: arrayUnion(panelRef),
  });
  return result.id;
}
