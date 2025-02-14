"use client"

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '../loading/page';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //  if (status === "loading") {
  //         return <Loading/>;
  //     }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

//   if(Loading){
// return (<Loading/>)
//   }
  return (
    <div className="w-full z-50 fixed top-2 max-w-6xl flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold text-white"><Link href={"/"}>Learnfinity</Link></h1>
      <div className="flex items-center space-x-6 ">
        <Link href="/chatbot" className="text-white mx-4 hover:text-violet-300 transition">
          AI Chat
        </Link>
        {session?.user ? (
          <div className="relative z-50">
            <button
              className="flex items-center space-x-2"
              onClick={toggleDropdown}
            >
              <img
                src={session.user.image}
                alt="User profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="hidden md:inline-block font-medium">
                {session.user.name}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-purple-600 text-white rounded-lg shadow-lg py-2 ">
                <a
                  href="/auth/profile"
                  className="block px-4 py-2 hover:bg-violet-700"
                >
                  Profile
                </a>
                {session.user.isAdmin ? (<a
                  href="/admin/dashboard"
                  className="block px-4 py-2 hover:bg-violet-700"
                >
                  Dashboard
                </a>) : ("")}

                <button
                  onClick={() =>
                    signOut()
                  }
                  className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-violet-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="lg:mt-1 mt-48 flex items-center px-4 py-2 border rounded-md shadow-sm text-lg font-medium bg-violet-600 text-white"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}