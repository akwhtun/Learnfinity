"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Tool from "../components/Tool";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <Tool>
    <motion.div 
      className="max-w-4xl mx-auto px-6 py-6 text-center text-white"
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
                    <Link
                        href={"/"}
                        className="flex items-center absolute left-0 top-0 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl font-bold text-purple-600">About Learnfinity</h1>
                </div>
       
        <p className="mt-4 text-lg text-white">
          Learnfinity is your gateway to mastering English in an engaging and interactive way!  
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        className="shadow-lg rounded-xl p-8 mb-12 text-left"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white">🌍 Our Mission</h2>
        <p className="mt-4 text-white">
          At Learnfinity, we believe that learning a language should be fun, interactive, and accessible for everyone.  
          Our goal is to provide a **gamified, multimedia-rich learning experience** that helps learners improve their English skills effectively.
        </p>
      </motion.div>

      {/* Why Learnfinity Section */}
      <motion.div 
        className="bg-pruple-700 shadow-lg rounded-xl p-8 text-left"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl text-white font-semibold ">🚀 Why Choose Learnfinity?</h2>
        <ul className="mt-4 text-white list-disc list-inside">
          <li className="mb-2">✅ **Interactive lessons** designed to make learning fun.</li>
          <li className="mb-2">✅ **Gamified learning** with quizzes and challenges.</li>
          <li className="mb-2">✅ **Audio & visual tools** for better pronunciation and understanding.</li>
          <li className="mb-2">✅ **AI-powered sign language support** for an inclusive experience.</li>
          <li className="mb-2">✅ **Progress tracking** to keep you motivated.</li>
        </ul>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/lessons/lists"
          className="px-6 py-3 bg-purple-700 text-white text-lg font-semibold rounded-lg shadow hover:bg-purple-700 transition"
        >
          Start Your Learning Journey
        </Link>
      </motion.div>
    </motion.div>
    </Tool>
  );
}
