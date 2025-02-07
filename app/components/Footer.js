import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 py-6 text-center text-font mt-16 shadow-md">
    <p className="text-gray-600">© {new Date().getFullYear()} Learnfinity. All rights reserved.</p>
    <div className="space-x-4 mt-2">
      <Link href="/privacy" className="text-gray-700 hover:text-blue-500">Privacy Policy</Link>
      <Link href="/terms" className="text-gray-700 hover:text-blue-500">Terms of Service</Link>
      <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
    </div>
  </footer>
  )
}
