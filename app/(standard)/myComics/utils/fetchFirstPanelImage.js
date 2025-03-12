import { doc, getDoc } from "firebase/firestore";

export default async function fetchFirstPanelImage(panelRef) {
  try {
    const panelSnapshot = await getDoc(panelRef);
    const panelInfo = panelSnapshot.data();
    return panelInfo.drawingDataUrl;
  } catch (error) {
    console.error("error fetching panel", error);
  }
}
