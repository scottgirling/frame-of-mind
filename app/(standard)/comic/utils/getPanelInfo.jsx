// import { db } from "@/lib/firebase";
import { getDoc } from "firebase/firestore";

export default async function getPanelInfo(panelRef) {
  try {
    const panelSnapshot = await getDoc(panelRef);

    if (panelSnapshot.exists()) {
      return panelSnapshot.data(); // This is the panel obj
    } else {
      console.log("No such panel found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching panel:", error);
  }
}
