"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
    { word: "elephant", image: "/images/elephant.jpg" },
    { word: "giraffe", image: "/images/giraffe.jpg" },
    { word: "kangaroo", image: "/images/kangaroo.jpg" },
    { word: "zebra", image: "/images/zebra.jpg" },
];

export default function VocabularyGame() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [blanks, setBlanks] = useState([]);
    const [blankWord, setBlankWord] = useState("")
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [index, setIndex] = useState(-1)

    // Generate blanks for the current word
    useEffect(() => {
        const word = words[currentWordIndex].word;
        const blankCount = Math.min(3, word.length - 1); 
        const blankPositions = [];
        // Randomly select positions for blanks
        while (blankPositions.length < blankCount) {
            const pos = Math.floor(Math.random() * word.length);
            if (!blankPositions.includes(pos) && pos !== 0 && pos !== word.length - 1) {
                blankPositions.push(pos);
            }
        }

        // Create the word with blanks
        const wordWithBlanks = word
            .split("")
            .map((char, index) => (blankPositions.includes(index) ? "_" : char))
            .join("");

        setBlanks(blankPositions);
        setBlankWord(wordWithBlanks);
    }, [currentWordIndex]);

    // Handle user input
    const handleInput = (e) => {
      
        const input = e.target.value;
        setUserInput(input);
        setIndex(pre => pre+1)

        let currentWord =words[currentWordIndex].word; 
       
        // Check if the input matches the word
        if (input === currentWord) {
            setFeedback("Correct! 🎉");
            setScore(score + 1);
        } else if(input !== currentWord  && input.length == currentWord.length) {
            setFeedback(`Wrong! ❌, Correct Word : ${currentWord}`);
        }

        if(input.length == currentWord.length){
            setTimeout(() => {
                setFeedback("");
                setUserInput("")
                setCurrentWordIndex((prev) => (prev + 1) );
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-purple-800 mb-8">
                Vocabulary Game 🎮
            </h1>

            {/* Game Container */}
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center">
                {/* Picture */}
                <img
                    src={words[currentWordIndex].image}
                    alt="Guess the word"
                    className="w-64 h-64 mx-auto object-cover rounded-lg mb-6"
                />

                {/* Word with Blanks */}
                <div className={`text-3xl font-bold  mb-6`}>
                    {blankWord.split("").map((char, index) => (
                        <span
                            key={index}
                            className={blanks.includes(index) ? "text-red-500" : char==userInput.split("")[index] ? "text-green-500": "text-blue-500"}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInput}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-2xl text-center"
                    maxLength={words[currentWordIndex].word.length}
                />

                {/* Feedback */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 text-2xl font-semibold"
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Score */}
                <div className="mt-6 text-xl text-gray-700">
                    Score: <span className="font-bold text-purple-800">{score}</span>
                </div>
            </div>

            {/* Instructions */}
            <p className="mt-8 text-gray-600 text-center max-w-2xl">
                Look at the picture and fill in the blanks to complete the word. Good luck! 🍀
            </p>
        </div>
    );
}