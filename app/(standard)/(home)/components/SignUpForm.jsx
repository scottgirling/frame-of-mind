import signUp from "@/app/auth/signUp";
import { useState } from "react";

export default function SignUpForm({ setCurrentForm }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    async function handleForm(event) {
        event.preventDefault();
        await signUp(displayName, email, password);
        setCurrentForm(null);
    }

    return (
        <form onSubmit={handleForm}>
            <label>
                Email:
                <input
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 text-gray-950 border border-gray-300 mx-2 py-1 px-3 rounded"
                type="email"
                placeholder="email@website.com"
                value={email}
                ></input>
            </label>
            <label>
                Username:
                <input
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-gray-50 text-gray-950 border border-gray-300 mx-2 py-1 px-3 rounded"
                type="text"
                placeholder="Your username"
                value={displayName}
                ></input>
            </label>
            <label>
                Password:
                <input
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 text-gray-950 border border-gray-300 mx-2 py-1 px-3 rounded"
                type="password"
                placeholder="password"
                value={password}
                required
                ></input>
            </label>

            <button
                type="submit"
                className="bg-blue-400 px-3 py-2 rounded hover:bg-blue-300"
            >
                Sign up
            </button>
        </form>
    )
}