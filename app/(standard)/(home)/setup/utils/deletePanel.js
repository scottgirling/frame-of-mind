import { db } from "@/lib/firebase";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";

export default async function deletePanel(uid, comicId, panelId) {
  try {
    // Delete panel from panels collection
    const panelRef = doc(db, "panels", panelId);
    await deleteDoc(panelRef);
    console.log(`Panel ${panelId} deleted from panels collection.`);

    // 2. Delete panel from panels array in the comics doc
    const comicRef = doc(db, "comics", comicId);
    await updateDoc(comicRef, {
      panels: arrayRemove(panelRef),
    });
    console.log(
      `Panel ${panelId} removed from panels array in comic ${comicId}.`
    );
  } catch (error) {
    console.error("Error deleting panel:", error);
  }
}
