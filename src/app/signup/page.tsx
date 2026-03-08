"use client";

import { useState } from "react";
import { signUp } from "../../lib/auth/client";

import Link from "next/link";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await signUp({
      email,
      password,
      name,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 
                   px-4 py-2 rounded-full text-sm font-medium
                   bg-blue-600/10 text-blue-400 border border-blue-500/30
                   hover:bg-blue-600/20 hover:text-blue-300 transition"
      >
        Daily<span className="text-blue-500">DO</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 p-6 rounded-lg shadow-md space-y-4 text-white"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-gray-400">
            Sign up to get started
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
