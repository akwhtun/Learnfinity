"use client";
import React, { useState, useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTestQuizes } from "../../libs/fetcher";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";
import Link from "next/link";
import Tool from "@/app/components/Tool";

export default function VocabularyGame({ params }) {
    const router = useRouter();
    const { id } = React.use(params)
    const scoreRef = useRef(0)
    const [quiz, setQuiz] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [blanks, setBlanks] = useState([]);
    const [blankWord, setBlankWord] = useState("")
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [sentenceWord, setSentenceWord] = useState('')

    useEffect(() => {
        const fetchAllTestQuizes = async () => {
            try {
                setLoading(true)
                const data = await fetchTestQuizes(id);
                setQuiz(data.testQuizes);
            } catch (error) {
                setError("Error fetching quizes:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTestQuizes();
    }, []);

    // Generate blanks for the current word
    useEffect(() => {
        if (quiz.length > 0 && quiz[currentWordIndex]) {
            const word = quiz[currentWordIndex].quizWord;
            const blankCount = Math.min(3, word.length - 2);
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

            //split sentence and show
            let sentenceWord;
            if (quiz[currentWordIndex].wordSplit == 2) {
                const currentWord = quiz[currentWordIndex]
                sentenceWord = currentWord.sentence.split(" ").map(word => (word == currentWord.quizWord ? "___" : word)).join(" ")
            }
            setSentenceWord(sentenceWord)

            setBlanks(blankPositions);
            setBlankWord(wordWithBlanks);
        }
    }, [currentWordIndex, quiz]);

    // Handle user input
    const handleInput = (e) => {

        const input = e.target.value;
        setUserInput(input);

        let currentWord = quiz[currentWordIndex].quizWord;

         // Check if the input matches the word
         if (input === currentWord) {
            setFeedback("Correct! 🎉");
            scoreRef.current += 1; 
            setScore(scoreRef.current); 
        } else if (input !== currentWord && input.length == currentWord.length) {
            setFeedback(`Wrong! ❌, Correct Word : ${currentWord}`);
        }

          if (input.length == currentWord.length) {
            setTimeout(() => {
                setFeedback("");
                setUserInput("")
                if (currentWordIndex < quiz.length - 1) {
                    setCurrentWordIndex((prev) => (prev + 1));
                }
                if (currentWordIndex == quiz.length - 1) {
                    router.push(`/tests/save?score=${scoreRef.current}&total=${quiz.length}&testId=${quiz[0].Test.id}`)
                }
            }, 1500);
        }
     
    };

    if (error) {
        return (<Error error={error} />)
    }

    if (loading) {
        return (<Loading />)
    }

    return (
        <Tool>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-purple-600 mb-6">
                Vocabulary Game 🎮
            </h1>

            {/* Game Container */}
            {quiz.length > 0 ?
                (<div>
                    <div className="relative mb-4">
                      <Link
                href={"/tests"}
                className="absolute top-0 left-4 text-purple-600 hover:text-purple-600 text-3xl 
                font-extrabold"
            >
                &larr;
            </Link >
                    <h2 className="text-2xl text-center font-bold text-purple-600 ">
                        {quiz[0].Test.title}
                    </h2>
                    </div>
                    <div className="rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center ">
                       
                        <p className="text-2xl font-bold text-purple-600 mb-3 -mt-1">
                            {currentWordIndex + 1} / {quiz.length}
                        </p>
                        {/* Picture */}
                        <img
                            src={`/uploads/quizes/${quiz[currentWordIndex].image}`}
                            alt="Guess the word"
                            className="w-64 h-64 mx-auto object-cover rounded-lg mb-6"
                        />

                        {quiz[currentWordIndex].wordSplit == 2 ? (<div className="mt-10 mb-2 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg  text-xl transform transition-al"> {sentenceWord}</div>) : (<div></div>)}

                        {/* Word with Blanks */}
                        <div className={`text-3xl font-bold mb-6`}>
                            {blankWord.split("").map((char, index) => (
                                <span
                                    key={index}
                                    className={blanks.includes(index) ? "text-black" : char == userInput.split("")[index] ? "text-green-500" : "text-blue-500"}
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
                            className="w-full p-3 text-purple-600 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-2xl text-center"
                            maxLength={quiz[currentWordIndex].quizWord.length}
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
                        <div className="mt-6 text-xl text-black">
                            Score: <span className="font-bold text-purple-600">{score}</span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <p className="mt-8 text-black text-center max-w-2xl">
                        Look at the picture and fill in the blanks to complete the word. Good luck! 🍀
                    </p>
                </div>) : (<div className="text-xl text-red-500 text-center py-10">No quiz found...</div>)
            }
        </div>
        </Tool>
    );
}