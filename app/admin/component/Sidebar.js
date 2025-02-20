import React from 'react'
import Link from 'next/link'


export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-purple-800 text-white p-6 shadow-xl">
    <Link href={"/"}><h1 className="text-2xl font-bold mb-8">Learnfinity Admin</h1></Link>
    <nav>
    <ul className="space-y-3">
  <li>
    <Link
      href="/admin/dashboard"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">📊</span>
      Dashboard
    </Link>
  </li>
  <li>
    <Link
      href="/admin/viewUsers"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">👤</span>
      Users
    </Link>
  </li>
  <li>
    <Link
      href="/admin/skills"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">📚</span>
      Skills
    </Link>
  </li>
  <li>
    <Link
      href="/admin/lessons"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">🎓</span>
      Lessons
    </Link>
  </li>
  <li>
    <Link
      href="/admin/activities"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">🧩</span>
      Activities
    </Link>
  </li>
  <li>
    <Link
      href="/admin/vocabularies"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">📙</span>
      Vocabularies
    </Link>
  </li>
  <li>
    <Link
      href="/admin/tests"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">📈</span>
      Tests
    </Link>
  </li>
  <li>
    <Link
      href="/admin/multipleChoices"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">📝</span>
      Multiple Choices
    </Link>
  </li>
  <li>
    <Link
      href="/admin/quizes"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">❓</span>
      Quizzes
    </Link>
  </li>
  <li>
    <Link
      href="/admin/pronounciations"
      className="flex items-center p-3 hover:bg-blue-700 rounded-lg transition duration-300"
    >
      <span className="mr-2">🗣️</span>
      Pronounciations
    </Link>
  </li>
</ul>
    </nav>
  </div>
  )
}
