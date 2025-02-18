"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Jobs from "@/app/jobs/page";
import Link from "next/link";

export default function Page() {
  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-6 shadow-md">
        <Link href="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa2MIKJFzxdfzDrXwbElUQZnWVxbNiGKAq2g&s"
            alt="logo"
            width={60}
            height={10}
            className="rounded-full"
          />
        </Link>
        <ul className="flex space-x-6">
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
          <li>
            <Link className="cursor-pointer" href="/detail">
              Detail
            </Link>
          </li>
          <li>
            <Link className="cursor-pointer" href="/contact-us">
              Contact Us
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <Link className="text-sm" href="/auth/login">
            Login
          </Link>
          <Link
            className="px-4 py-2 bg-green-500 rounded-lg text-sm"
            href="/auth/register"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center mt-16">
        <h1 className="text-5xl font-extrabold">Find Your Dream Job Today!</h1>
        <p className="text-gray-400 mt-3">
          Connecting Talent with Opportunity: Your Gateway to Career Success
        </p>
      </section>

      <section className="mt-12 flex justify-center space-x-16 text-center">
        <div>
          <h2 className="text-2xl font-bold">25,850</h2>
          <p className="text-gray-400">Jobs</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">10,220</h2>
          <p className="text-gray-400">Candidates</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">18,400</h2>
          <p className="text-gray-400">Companies</p>
        </div>
      </section>

      <section className="flex justify-center mt-16 space-x-10">
        <img
          src="https://t4.ftcdn.net/jpg/03/95/35/17/360_F_395351750_edaLRQmUwxIjtgMuZ3WZgyVlT8yvcbx7.jpg"
          alt="Spotify"
          width={100}
          height={50}
        />
        <img
          src="https://i.pcmag.com/imagery/reviews/07td46ju7p6lLVb0QGwc5VF-6.fit_scale.size_760x427.v1569479844.jpg"
          alt="Slack"
          width={100}
          height={50}
        />
        <img
          src="https://www.adobe.com/content/dam/cc/us/en/products/Adobe-social-share-image.jpg"
          alt="Adobe"
          width={100}
          height={50}
        />
        <img
          src="https://i.pcmag.com/imagery/reviews/07koiYlrzusMasUtb8S1jz8-14..v1580335304.png"
          alt="Asana"
          width={100}
          height={50}
        />
        <img
          src="https://blog.lama.dev/images/next-auth-iron-session-server-action.png"
          alt="session"
          width={100}
          height={50}
        />
      </section>
      <Jobs />
    </div>
  );
}
