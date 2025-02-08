import { motion, AnimatePresence } from "framer-motion";

export default function Alert({ type, message, onClose }) {
  // Define colors and icons based on alert type
  const alertConfig = {
    success: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "✅",
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "❌",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "⚠️",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "ℹ️",
    },
  };

  const { bg, text, icon } = alertConfig[type] || alertConfig.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed z-10 top-20 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg ${bg} ${text} flex items-center space-x-3`}
      >
        <span className="text-xl">{icon}</span>
        <p className="font-semibold">{message}</p>
        <button onClick={onClose} className="ml-4 text-xl hover:opacity-70">
          &times;
        </button>
      </motion.div>
  </AnimatePresence>
  
  );
}