import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage({ user }) {

    return (
        <>
        <p>You are logged in as {user.displayName}</p>
        <button
          className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300 mt-5"
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign out
        </button>
      </>
    )
}