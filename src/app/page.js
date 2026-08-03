"use client";

import { signInWithGoogle } from "@/action/auth/google";



export default function Home() {
  async function handleGoogleLogin() {
    const url = await signInWithGoogle();
    window.location.href = url;
  }

  return <button className="bg-black cursor-pointer text-2xl text-white" onClick={handleGoogleLogin}>Login with Google</button>;
}
