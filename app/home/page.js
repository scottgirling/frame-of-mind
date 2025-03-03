"use client"

import { useAuthContext } from "../contexts/LoggedInUser";

export default function Home() {
    const { user } = useAuthContext();
    
    return (
        <>
        {console.log(user)}
        <p>You are logged in as {user.displayName}</p>
        </>
    )
}