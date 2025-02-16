"use client";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Tool from "../components/Tool";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { TrophyIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
// Sample questions (add more for difficulty)
const questions = [
  { level: 1, question: "What is the opposite of 'happy'?", answer: "sad", options: ["sad", "angry", "joyful"] },
  { level: 2, question: "What is the synonym of 'big'?", answer: "large", options: ["small", "large", "tiny"] },
  { level: 3, question: "What is the past tense of 'run'?", answer: "ran", options: ["ran", "runned", "running"] },
  { level: 4, question: "What is the plural of 'child'?", answer: "children", options: ["childs", "children", "kids"] },
  { level: 5, question: "What is the meaning of 'benevolent'?", answer: "kind", options: ["kind", "cruel", "selfish"] },
];

export default function GamePage() {
  const scoreRef = useRef(0);
  const liveRef = useRef(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [showDoors, setShowDoors] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [doorEffect, setDoorEffect] = useState(null);
  const [shake, setShake] = useState(false);
  const [correctDoor, setCorrectDoor] = useState(null);
  const [liveDoor, setLiveDoor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const router = useRouter();

  // Get the current question
  let question;
  if (currentQuestion < questions.length) {
    question = questions[currentQuestion];
  }

  // Randomize the correct door
  useEffect(() => {
    if (showDoors) {
      const correct = Math.floor(Math.random() * 3) + 1;
      let live;

      do {
        live = Math.floor(Math.random() * 3) + 1;
      } while (live === correct);

      setCorrectDoor(correct);
      setLiveDoor(live);
    }
  }, [showDoors]);

  // Handle answer submission
  const handleAnswer = (answer) => {
    setSelectedOption(answer);

    if (answer === question.answer) {
      setShowDoors(true);
    } else {
      setShake(true);
      setWrongAnswer(true);
      setLives((prev) => prev - 1);
      if (lives - 1 === 0) {
        setGameOver(true);
      }
      setTimeout(() => (setShake(false), setWrongAnswer(false)), 500);
    }
  };

  const handleDoorSelect = (door) => {
    setSelectedDoor(door);

    let effect;
    let newScore = score;
    let newLives = lives;

    if (door === correctDoor) {
      effect = "scoreUp";
      newScore += 10;
      setScore(newScore);
    } else if (door === liveDoor) {
      effect = "liveUp";
      newLives += 1;
      setLives(newLives);
    } else {
      effect = "normal"; // No effect for wrong door
    }

    setDoorEffect(effect);

    // Reset after a delay
    setTimeout(() => {
      setShowDoors(false);
      setSelectedDoor(null);
      setDoorEffect(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        // Use updated values
        const finalLives = newLives === 0 ? 1 : newLives;
        const finalScores = newScore === 0 ? 1 : newScore;
        const finalScore = finalLives * finalScores;

        console.log("Final Score:", finalScore); // Debugging
        console.log("Final Lives:", finalLives); // Debugging
        console.log("Final Scores:", finalScores); // Debugging

        router.push(`/tests/save?score=${finalScore}&testId=6`);
      }
    }, 1500);
  };

  // Reset the game
  const resetGame = () => {
    setCurrentQuestion(0);
    setLives(3);
    scoreRef.current = 1;
    liveRef.current = 3;
    setScore(0);
    setGameOver(false);
    setShowDoors(false);
    setSelectedDoor(null);
    setDoorEffect(null);
  };

  return (
    <Tool>
      <div className="min-h-screen bg-gradient-to-r  flex flex-col items-center p-8 text-white">
      <div className="flex w-full mb-4 items-center justify-between px-4 md:px-8 py-4 bg-gray-900 rounded-lg shadow-lg">
  {/* Back Button */}
  <Link href={"/"} className="p-2 text-white rounded-lg hover:bg-gray-700 transition">
    <ArrowLeftIcon className="w-6 h-6" />
  </Link>

  {/* Title */}
  <h1 className="text-xl md:text-3xl font-bold text-white text-center flex-1">
    Game
  </h1>

  {/* Ranks Button */}
  <Link
    href={"/tests/rank"}
    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-md transition"
  >
    <TrophyIcon className="w-6 h-6" />
    <span className="hidden md:inline">Ranks</span>
  </Link>
</div>

        {/* Game Over Screen */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
            >
              <div className="bg-gray-800 rounded-xl p-8 text-center shadow-lg">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h1>
                <p className="text-xl text-gray-300 mb-6">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game UI */}
        <motion.div
          className={`w-full max-w-2xl bg-gray-900 rounded-xl shadow-xl p-8 text-center ${shake ? "animate-shake" : ""
            }`}
        >
          {/* Lives and Score */}
          <div className="flex justify-between mb-6">
            <div className="text-lg font-semibold">
              Lives: {lives} ❤️
            </div>
            <div className="text-lg font-semibold">
              Score: {score} 🏆
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold mb-6">
            {question && question.question}
          </h2>

          {wrongAnswer && (
            <motion.h5
              className="text-2xl font-bold mb-6 text-red-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              ❌ Wrong Answer! Try Again.
            </motion.h5>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectedOption ? (selectedOption !== question.answer && handleAnswer(option)) : handleAnswer(option)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Doors */}
          <AnimatePresence>
            {showDoors && (
              <motion.div className="grid grid-cols-3 gap-4 mt-8">
                {[1, 2, 3].map((door) => (
                  <motion.div
                    key={door}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => !selectedDoor && handleDoorSelect(door)}
                    className={`relative cursor-pointer `}
                  >
                    {/* Realistic Wooden Door */}
                    <div className="w-32 h-48 bg-yellow-700 rounded-lg shadow-lg flex items-center justify-center border-4 border-yellow-800">
                      <div className="w-6 h-24 bg-yellow-900 rounded-l-lg"></div>
                      <div className="w-8 h-8 bg-yellow-600 rounded-full shadow-inner"></div>
                    </div>

                    {/* Door Effect */}
                    {selectedDoor === door && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex items-center justify-center rounded-lg"
                        style={{
                          backgroundColor:
                            doorEffect === "scoreUp" ? "rgba(52, 211, 153, 0.8)" : // Green for score up
                              doorEffect === "liveUp" ? "rgba(59, 130, 246, 0.8)" : // Blue for live up
                                "rgba(156, 163, 175, 0.8)", // Default gray for normal doors
                        }}
                      >
                        <span className="text-2xl font-bold">
                          {doorEffect === "scoreUp" ? "Score +10 🏆" :
                            doorEffect === "liveUp" ? "Extra Life ❤️" :
                              "No Effect"}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Tool>
  );
}