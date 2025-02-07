'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  
const features = [
  {
    icon: "📚",
    title: "Interactive Lessons",
    description: "Engage in exciting lessons that make learning fun and effective."
  },
  {
    icon: "🎮",
    title: "Gamified Learning",
    description: "Enjoy games and challenges that turn education into an adventure."
  },
  {
    icon: "🎧",
    title: "Audio & Visual Learning",
    description: "Improve pronunciation and comprehension with interactive multimedia."
  }
];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-between p-6 relative overflow-hidden text-font">
    
      <div className="flex flex-col items-center justify-center flex-grow mt-10 text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-gray-800">
            Welcome to <span className="text-blue-500 logo-font">Learnfinity</span>
          </h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto text-gray-700">
            The ultimate interactive platform where learning meets fun. Engaging activities, games, and lessons tailored for young learners!
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6"
          >
            <Link href="/signup">
              <button className="bg-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-blue-400 transition">
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
              className="bg-gray-200 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-5xl mb-3 text-blue-500">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

