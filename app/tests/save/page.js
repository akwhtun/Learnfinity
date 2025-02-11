"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function QuizResult() {

  const searchParams = useSearchParams()
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState(null);
  const score = searchParams.get("score")
  const total = searchParams.get("total")

  const handleSave = () => {
    // Add your saving logic here (e.g., an API call)
    setSaveStatus("saved");
  };

  const handleDontSave = () => {
    setSaveStatus("not_saved");
    // Optionally, navigate back to the home or dashboard page
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-200 p-6">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-purple-600 mb-4">
          Great Job!
        </h1>
        <p className="text-2xl text-gray-800 mb-6">
          Your Score:{" "}
          <span className="text-green-500 font-extrabold">{score}</span> /{" "}
          {total}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Would you like to save your result?
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
          >
            Save Result
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 transition transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDontSave}
          >
            Don't Save
          </motion.button>
        </div>
        {saveStatus === "saved" && (
          <motion.div
            className="mt-6 text-xl text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Result saved successfully!
          </motion.div>
        )}
        {saveStatus === "not_saved" && (
          <motion.div
            className="mt-6 text-xl text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Result not saved.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
