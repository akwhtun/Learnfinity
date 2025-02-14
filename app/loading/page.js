'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent min-h-screen  text-gray-900">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <motion.div
          className="w-6 h-6 bg-blue-500 rounded-full"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-6 h-6 bg-green-500 rounded-full"
          animate={{ y: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.div
          className="w-6 h-6 bg-purple-500 rounded-full"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
        />
      </motion.div>
      <motion.h2
        className="mt-6 text-2xl font-bold text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Learnfinity
        <motion.span
          className="inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        >.</motion.span>
        <motion.span
          className="inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
        >.</motion.span>
        <motion.span
          className="inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
        >.</motion.span>
      </motion.h2>
    </div>
  );
}
