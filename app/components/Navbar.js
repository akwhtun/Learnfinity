import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center mb-14 text-font py-4 px-8 bg-gray-200 shadow-md fixed top-0 left-0 right-0 z-20">
    <h2 className="text-2xl font-bold text-blue-500 logo-font">Learnfinity</h2>
    <div className="hidden md:flex space-x-6">
      <Link href="/lessons" className="text-gray-700 hover:text-blue-500">Lessons</Link>
      <Link href="/games" className="text-gray-700 hover:text-blue-500">Games</Link>
      <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
    </div>
    <Link href="/signup">
      <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:bg-blue-400 transition">
        Get Started
      </button>
    </Link>
  </nav>
  )
}
