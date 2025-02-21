'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import Tool from './components/Tool';

export default function HomePage() {
  const features = [
    {
      icon: "📚",
      title: "Interactive Lessons",
      description: "Engage in exciting lessons that make learning fun and effective.",
      link : "/lessons/lists"
    },
    {
      icon: "🎮",
      title: "Gamified Learning",
      description: "Enjoy games and challenges that turn education into an adventure.",
       link : "/game"
    },
    {
      icon: "🎧",
      title: "Audio & Visual Learning",
      description: "Improve pronunciation and comprehension with interactive multimedia.",
       link : "/pronounciations"
    },
    {
      icon: "📝",
      title: "Tests",
      description: "Take quizzes and tests to track your progress and improve your skills.",
       link : "/tests"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress reports.",
       link : "/tests/rank"
    },
    {
      "icon": "🤟",
      "title": "Sign Language Community",
      "description": "Join a supportive community of sign language learners and experts to share knowledge and improve your skills.",
       link : "/"
    }
    
  ];

  return (
    <div>
      <Tool>
        <div className="flex flex-col items-center justify-center flex-grow mt-10 text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-white">
              Welcome to <span className="text-violet-300">Learnfinity</span>
            </h1>
            <p className="text-lg mt-4 max-w-2xl mx-auto text-violet-200">
              The ultimate interactive platform where learning meets fun. Engaging activities, games, and lessons tailored for young learners!
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6"
            >
              <Link href="/signup">
                <button className="bg-violet-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-violet-700 transition">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Feature Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl z-10 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300 border border-white/20"
              >
                <Link href={feature.link}>
                <div className="text-5xl mb-3 text-violet-300">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-violet-200">{feature.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Tool>
    </div>
  );
}