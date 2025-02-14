"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTestMultipleChoices } from "../../libs/fetcher";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";
import Tool from "@/app/components/Tool";

export default function MultipleChoiceQuiz({ params }) {

    const { id } = React.use(params)
    const scoreRef = useRef(0)
    const router = useRouter();
    const [multipleChoices, setMultipleChoices] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [shuffledAnswers, setShuffledAnswers] = useState([])

    const currentQuestion = multipleChoices[currentQuestionIndex];

    useEffect(() => {
        const fetchAllTestMultipleChoices = async () => {
            try {
                setLoading(true)
                const data = await fetchTestMultipleChoices(id);
                setMultipleChoices(data.testMultipleChoices);
            } catch (error) {
                setError("Error fetching quizes:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTestMultipleChoices();
    }, []);

    useEffect(() => {
        if (multipleChoices.length > 0 && currentQuestion) {
            const answers = [currentQuestion.answer, ...currentQuestion.otherWords.split(",")];
            setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
        }
    }, [currentQuestion]);

    // Handle answer selection
    const handleAnswerClick = (answer) => {
        if (!showFeedback) {
            setSelectedAnswer(answer);
            setShowFeedback(true);

            if (answer === currentQuestion.answer) {
                scoreRef.current += 1
                setScore(scoreRef.current);
            }

            // Move to the next question after a delay
            setTimeout(() => {
                setSelectedAnswer(null);
                setShowFeedback(false);
                if (currentQuestionIndex < multipleChoices.length - 1) {
                    setCurrentQuestionIndex((prev) => (prev + 1));
                }
                if (currentQuestionIndex == multipleChoices.length - 1) {
                    router.push(`/tests/save?score=${scoreRef.current}&total=${multipleChoices.length}&testId=${multipleChoices[0].Test.id}`)
                }
            }, 1500);
        }
    };

    // Handle audio playback
    const handlePlayAudio = () => {
        const speech = new SpeechSynthesisUtterance(currentQuestion.question);
        speech.lang = "en-US";
        speech.rate = 0.9;
        speech.pitch = 1.1;
        window.speechSynthesis.speak(speech);
    };

    if (error) {
        return (<Error error={error} />)
    }

    if (loading) {
        return (<Loading />)
    }

    return (
        <Tool>
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-violet-200 mb-4">
                Multiple Choice Quiz 🎮
            </h1>
    
            {multipleChoices.length > 0 ? (
                <div>
                    <div className="relative mb-4">
                        <Link
                            href={"/tests"}
                            className="absolute top-0 left-4 text-violet-200 hover:text-violet-300 text-3xl font-extrabold transition"
                        >
                            &larr;
                        </Link>
                        <h2 className="text-2xl text-center font-bold text-violet-200">
                            {multipleChoices[0].Test.title}
                        </h2>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center border-2 border-violet-500/30">
                        {/* Question Counter */}
                        <p className="text-2xl font-bold text-violet-200 mb-3 -mt-1">
                            {currentQuestionIndex + 1} / {multipleChoices.length}
                        </p>
    
                        {/* Question */}
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <h2 className="text-2xl font-semibold text-violet-100">
                                {currentQuestion.question}
                            </h2>
                            <button
                                onClick={handlePlayAudio}
                                className="p-2 bg-violet-500/10 backdrop-blur-md rounded-full hover:bg-violet-500/20 transition"
                            >
                                🔊
                            </button>
                        </div>
    
                        {/* Image */}
                        {currentQuestion.image && (
                            <img
                                src={currentQuestion.image}
                                alt="Question Image"
                                className="w-64 h-64 mx-auto object-cover rounded-lg mb-6 border-2 border-violet-500/30"
                            />
                        )}
    
                        {/* Answer Choices */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {shuffledAnswers.map((answer, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswerClick(answer)}
                                    className={`p-4 rounded-lg text-lg font-semibold transition ${showFeedback
                                        ? answer === currentQuestion.answer
                                            ? "bg-green-500/80 text-white"
                                            : selectedAnswer === answer
                                                ? "bg-red-500/80 text-white"
                                                : "bg-violet-500/10 backdrop-blur-md"
                                        : "bg-violet-500/10 backdrop-blur-md hover:bg-violet-500/20"
                                        }`}
                                    disabled={showFeedback}
                                >
                                    {answer}
                                </motion.button>
                            ))}
                        </div>
    
                        {/* Feedback */}
                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-6 text-2xl font-semibold text-violet-100"
                                >
                                    {selectedAnswer === currentQuestion.answer
                                        ? "Correct! 🎉"
                                        : "Oops! Try again. ❌"}
                                </motion.div>
                            )}
                        </AnimatePresence>
    
                        {/* Score */}
                        <div className="mt-6 text-xl text-violet-100">
                            Score: <span className="font-bold text-violet-200">{score}</span>
                        </div>
                    </div>
    
                    {/* Instructions */}
                    <p className="mt-8 text-violet-200 text-center max-w-2xl">
                        Listen to the question, choose the correct answer, and see how many you can get right! 🍀
                    </p>
                </div>
            ) : (
                <div className="text-xl text-red-400 text-center py-10">No quiz found...</div>
            )}
        </div>
    </Tool>
    );
}