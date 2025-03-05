import { app } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

const db = getFirestore(app);

export default async function addData(collection, id, data) {
  let result = null;
  let error = null;

  try {
    result = await setDoc(doc(db, collection, id), data, {
      merge: true,
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function addDataWithAutoID(collectionName, data) {
  let result = null;
  let error = null;
  try {
    result = await addDoc(collection(db, collectionName), data, {
      merge: true,
    });
  } catch (error) {
    console.log(error);
  }

  return { result, error };
}

// VIDEO TO WATCH ON PIXEL ART CANVAS: How to build a Pixel Art Drawing App in React | React Tutorial - https://www.youtube.com/watch?v=IAD68la3An8
