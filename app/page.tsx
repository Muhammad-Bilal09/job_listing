"use client";

import Jobs from "@/app/jobs/page";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LuLogOut } from "react-icons/lu";
import { companyLogos } from "@/constants/constants";

export default function Page() {
  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-4 lg:p-6 shadow-md flex-wrap">
        <Link href="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa2MIKJFzxdfzDrXwbElUQZnWVxbNiGKAq2g&s"
            alt="logo"
            width={60}
            height={10}
            className="rounded-full"
          />
        </Link>
        <ul className="hidden lg:flex space-x-6">
          <li>
            <Link className="cursor-pointer" href="/dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/jobs">
              Jobs
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-3 lg:space-x-4 mt-3 lg:mt-0">
          <Link className="text-sm max-sm:hidden" href="/auth/login">
            Login
          </Link>
          <Link
            className="px-4 py-2 max-sm:hidden bg-green-500 rounded-lg text-sm"
            href="/auth/register"
          >
            Register
          </Link>
          <button
            className="flex items-center gap-1 p-2 text-sm cursor-pointer text-black hover:text-white bg-red-500 hover:bg-red-400 rounded"
            onClick={() => {
              signOut();
            }}
          >
            Logout <LuLogOut />
          </button>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center text-center mt-12 px-4 lg:px-0">
        <h1 className="text-3xl lg:text-5xl font-extrabold">
          Find Your Dream Job Today!
        </h1>
        <p className="text-gray-400 mt-3">
          Connecting Talent with Opportunity: Your Gateway to Career Success
        </p>
      </section>
      <section className="flex flex-wrap justify-center mt-12 gap-6 px-6 lg:px-0">
        {companyLogos.map((company, index) => (
          <img
            key={index}
            src={company.src}
            alt={company.alt}
            width={80}
            height={40}
            className="w-20 md:w-24"
          />
        ))}
      </section>

      <Jobs />
    </div>
  );
}
