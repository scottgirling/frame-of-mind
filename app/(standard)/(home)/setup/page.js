"use client";

import { auth, db } from "@/lib/firebase";
import { Box, Button, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { query, collection, where, doc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

export default function CreateComicPage() {
  const [authUser, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isSolo, setIsSolo] = useState(true);
  const [showExistingComics, setShowExistingComics] = useState(false);
  const [existingSoloComics, setExistingSoloComics] = useState([]);

  async function continueExistingSolo(uid) {
    setLoading(true);
    const userRef = doc(db, "users", uid);
    const q = query(
      collection(db, "comics"),
      where("createdBy", "==", userRef),
      where("isSolo", "==", true),
      where("isCompleted", "==", false)
    );
    const querySnapshot = await getDocs(q);
    const existingSoloComics = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(existingSoloComics);
    setExistingSoloComics(existingSoloComics);
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <Box component={"section"}>
      <p>Choose your game-play modes below!</p>
      <Box>
        Solo
        <Switch
          onClick={() => {
            setIsSolo(!isSolo);
          }}
        />
        Team
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            if (authUser) {
              setShowExistingComics(true);
              continueExistingSolo(authUser.uid);
            }
          }}
        >
          Continue existing comic
        </Button>
        <Button variant="contained">New comic</Button>
        {console.log(showExistingComics, "<--- showExistingComics")}
        {console.log(existingSoloComics, "<--- existingSoloComics")}
        {showExistingComics && (
          <div>
            {existingSoloComics.length === 0 ? (
              <p>No existing comics found</p>
            ) : (
              existingSoloComics.map((comic) => {
                return (
                  <div key={comic.comicId}>
                    <Link href={"/create"} onClick={createPanel}>
                      <p>{comic.comicTheme}</p>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Box>
    </Box>
  );
}
