"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import getData from "../firestore/getData";

export const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // async function getUserData(uid) {
  //   const userData = (await getData("users", uid)).result;
  //   return userData;
  // }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed: ", user)
      setAuthUser(user);
    })
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (authUser) {
      console.log(authUser);
      
      // if (!authUser.displayName) {
      //     await authUser.reload();
      //   }

        setUser({
          displayName: authUser.displayName,
          email: authUser.email,
          password: authUser.password,
          avatarUrl: "",
          dayStreak: 0,
          weekStreak: 0,
          userBio: "",
          points: 0,
          createdAt: authUser.metadata.creationTime,
          myComics: [],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
  },[authUser])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
