"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import Tool from "@/app/components/Tool";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { fetchActivityVocabularies } from "@/app/admin/vocabularies/libs/fetcher";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";

const VocabularyPage = ({ params }) => {

    const { id } = React.use(params)
    const [vocabulary, setVocabulary] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAllActivityLessons = async () => {
            try {
                setLoading(true);
                const data = await fetchActivityVocabularies(id);
                setVocabulary(data.activityVocabularies);
            } catch (error) {
                setError("Error fetching activity vocabularies: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllActivityLessons();
    }, []);

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

    const speakWord = (word) => {
        if (!synth) {
            alert("Your browser doesn't support speech synthesis.");
            return;
        }

        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(word);
        setActiveId(word);
        utterance.onend = () => setActiveId(null);
        synth.speak(utterance);
    };

    if (loading) {
        return (<Loading />)
    }

    if (error) {
        return (<Error />)
    }

    return (
        <Tool>
            <div className="min-h-screen bg-transparent flex flex-col items-center p-6 font-serif">
                <div className="w-full relative flex items-center justify-center">
                    <button onClick={() => history.back()} className="absolute top-0 left-3 p-2 text-white rounded-lg hover:bg-gray-700 transition">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <motion.h2
                        className="text-3xl md:text-4xl font-extrabold text-white mb-6 px-6 py-2 rounded-full bg-white/20 shadow-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        🚀 Learn Vocabulary! 🎉
                    </motion.h2>
                </div>

                {
                    vocabulary.length > 0 ?

                        (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                            {vocabulary.map((word) => (
                                <motion.div
                                    key={word.id}
                                    className={`bg-white p-6 rounded-3xl shadow-xl border-4 ${activeId === word.englishWord ? "border-yellow-400 scale-110 shadow-2xl" : "border-violet-500"
                                        } flex flex-col items-center text-center space-y-3 transition-all`}
                                    whileTap={{ scale: 1.1 }}
                                >
                                    {/* Fun Animated Emoji */}
                                    <motion.div
                                        className="text-6xl"
                                        animate={activeId === word.englishWord ? { y: [0, -10, 0] } : {}}
                                        transition={{ repeat: activeId === word.englishWord ? Infinity : 0, duration: 1, ease: "easeInOut" }}
                                    >
                                        {word.emoji}
                                    </motion.div>

                                    {/* English Word */}
                                    <h2 className="text-3xl font-bold text-violet-700">{word.englishWord}</h2>

                                    {/* Myanmar Meaning */}
                                    <p className="text-xl text-violet-500">{word.myanmarMeaning}</p>

                                    {/* Speech Type */}
                                    <span className="text-sm font-semibold text-white bg-purple-600 px-2 py-1 rounded-full">
                                        {word.speech.toUpperCase()}
                                    </span>

                                    {/* Speech Button */}
                                    <button
                                        onClick={() => speakWord(word.englishWord)}
                                        className={`mt-4 px-6 py-3 text-white text-lg rounded-full shadow-lg flex items-center gap-2 transition-all ${activeId === word.englishWord
                                            ? "bg-blue-500 hover:bg-blue-400"
                                            : "bg-violet-600 hover:bg-violet-500"
                                            }`}
                                    >
                                        <SpeakerWaveIcon className="w-6 h-6" />
                                        {activeId === word.englishWord ? "🔊 Listening..." : "👂 Hear Pronunciation"}
                                    </button>
                                </motion.div>
                            ))}
                        </div>) : (<p className="text-center text-violet-200">No vocabularies found.</p>)}
            </div>
        </Tool>
    );
};

export default VocabularyPage;
