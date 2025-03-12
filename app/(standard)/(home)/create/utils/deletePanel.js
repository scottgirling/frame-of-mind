import { db } from "@/lib/firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export default async function deletePanel(
  uid,
  comicId,
  panelId,
  deleteEmpty = true
) {
  try {
    // Delete panel from panels collection
    const panelRef = doc(db, "panels", panelId);
    await deleteDoc(panelRef);
    console.log(`Panel ${panelId} deleted from panels collection.`);

    // 2. Delete panel from panels array in the comics doc
    const comicRef = doc(db, "comics", comicId);
    const comicSnapshot = await getDoc(comicRef);
    const panelsCount = comicSnapshot.data().panels.length;

    if (panelsCount === 1 && deleteEmpty) {
      await deleteDoc(comicRef);
    } else {
      await updateDoc(comicRef, {
        panels: arrayRemove(panelRef),
        isInProgress: false,
      });
    }
  } catch (error) {
    console.error("Error deleting panel:", error);
  }
}
