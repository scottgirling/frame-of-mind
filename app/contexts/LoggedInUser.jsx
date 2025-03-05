"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import getData from "../firestore/getData";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth, {
    onUserChanged: setUserData,
  });
  const [userProfile, setUserProfile] = useState({});

  async function getUserData(uid) {
    const userSnapshot = (await getData("users", uid)).result;
    const userData = userSnapshot.data();
    return userData;
  }

  async function setUserData(authUser) {
    if (authUser) {
      console.log("authUser ", authUser);

      const uid = authUser.uid;
      const userData = await getUserData(uid);
      if (userData && userData.hasOwnProperty("displayName")) {
        setUserProfile(userData);
      }
    } else {
      setUserProfile({});
    }

    return () => unsubscribe();
  }

  return (
    <AuthContext.Provider value={{ user: userProfile, userLoading: loading }}>
      {/* {loading ? <CircularProgress /> : children} */} {children}
    </AuthContext.Provider>
  );
};
