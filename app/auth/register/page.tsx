"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      return await axios.post("/api/register", data);
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-6">
      <div className="bg-white p-8 shadow-2xl rounded-lg w-96 text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Create an Account
        </h2>
        {mutation.isError && (
          <p className="text-red-500 text-center mb-4">Registration failed</p>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your Email"
              className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?
          <Link
            href="/auth/login"
            className="text-blue-500 hover:underline ml-1"
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
