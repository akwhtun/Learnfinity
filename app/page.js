'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import Tool from './components/Tool';
import { 
  BookOpenIcon, 
  PuzzlePieceIcon, 
  SpeakerWaveIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  HandRaisedIcon 
} from "@heroicons/react/24/outline";

export default function HomePage() {
const features = [
  { icon: BookOpenIcon, title: "Interactive Lessons", description: "Engage in exciting lessons that make learning fun and effective.", link: "/lessons/lists" },
  { icon: PuzzlePieceIcon, title: "Gamified Learning", description: "Enjoy games and challenges that turn education into an adventure." },
  { icon: SpeakerWaveIcon, title: "Audio & Visual Learning", description: "Improve pronunciation and comprehension with interactive multimedia." },
  { icon: ClipboardDocumentListIcon, title: "Tests & Quizzes", description: "Take quizzes and tests to track your progress and improve your skills.", link: "/tests" },
  { icon: ChartBarIcon, title: "Progress Tracking", description: "Monitor your learning journey with detailed progress reports.", link: "/tests/rank" },
  { icon: HandRaisedIcon, title: "Sign Language Support", description: "Get AI-powered support using sign language for instant help.", link: "/sign-language-chatbot" },
];
  return (
    <Tool>
    <div className="flex flex-col items-center justify-center flex-grow mt-2 text-center px-4 z-10">
      
      {/* Hero Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-violet-400">Welcome to Learnfinity</h1>
        <p className="mt-4 text-lg text-gray-300">
          Transforming language learning into a fun and engaging experience! 🚀
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-violet-800 shadow-lg rounded-xl p-6 text-left transition duration-300 hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-4">
              <feature.icon className="w-10 h-10 text-violet-300" />
              <h3 className="text-xl font-semibold ml-3 text-white">{feature.title}</h3>
            </div>
            <p className="text-gray-300">{feature.description}</p>
            {feature.link && (
              <Link href={feature.link} className="inline-block mt-3 text-violet-300 font-semibold hover:underline">
                Learn More →
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/signup"
          className="px-6 py-3 bg-violet-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
        >
          Start Learning Today
        </Link>
      </motion.div>

    </div>
  </Tool>
  );
}