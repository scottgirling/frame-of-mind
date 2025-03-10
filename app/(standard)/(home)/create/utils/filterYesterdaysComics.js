import { Timestamp } from "firebase/firestore";

export default function filterYesterdaysComics(existingComics) {
  const now = Timestamp.now().toMillis();
  const yesterday = now - 24 * 60 * 60 * 1000;
  return existingComics.filter((comic) => {
    const createdAtInMillis = comic.createdAt?.toMillis();
    return createdAtInMillis && createdAtInMillis >= yesterday;
  });
}
