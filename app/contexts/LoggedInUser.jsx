"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import getData from "../firestore/getData";

export const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  async function getUserData(uid) {
    // const userData = (await getData("users", uid)).result.get("displayName");
    const userSnapshot = (await getData("users", uid)).result
    const userData = userSnapshot.data()
    // console.log(userSnapshot.data(), "<--- userData")
    return userData;
  }
  
  useEffect(() => {
    setUser({});
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const uid = authUser.uid;
        const userData = await getUserData(uid)
        if (userData && userData.hasOwnProperty("displayName")) {
          setUser(userData);
        } 
      } else {
        setUser({});
      }
      setLoading(false);
      return () => unsubscribe();
    })
  }, [])
  
  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
