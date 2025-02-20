'use client'

import { useState, useEffect } from 'react';
import Loading from '../admin/loading/page';
import Error from '../admin/error/page';
import { fetchAllTexts } from '../admin/pronounciations/libs/fetcher';
import Tool from '../components/Tool';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
export default function SpeechRecognitionApp() {
    const [referenceTexts, setReferenceTexts] = useState([]);
    const [referenceText, setReferenceText] = useState("");
    const [userText, setUserText] = useState("");
    const [wordAccuracy, setWordAccuracy] = useState(null);
    const [spokenWordCount, setSpokenWordCount] = useState(0);
    const [referenceWordCount, setReferenceWordCount] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch reference texts on component mount
    useEffect(() => {
        async function fetchTexts() {
            try {
                setLoading(true);
                const data = await fetchAllTexts();
                setReferenceTexts(data.pronounciations || []); // Ensure it's an array
            } catch (error) {
                setError("Error fetching texts: " + error);
            } finally {
                setLoading(false);
            }
        }
        fetchTexts();
    }, []);

    // Load reference text when currentIndex or referenceTexts changes
    useEffect(() => {
        if (referenceTexts.length > 0) {
            loadReferenceText(currentIndex);
        }
    }, [currentIndex, referenceTexts]);

    const loadReferenceText = (index) => {
        if (referenceTexts.length === 0) {
            setReferenceText("No reference texts available.");
            setReferenceWordCount(0);
            return;
        }

        const textObject = referenceTexts[index];
        if (!textObject || !textObject.text) {
            setReferenceText("Invalid reference text.");
            setReferenceWordCount(0);
            return;
        }

        const text = textObject.text;
        setReferenceText(text);
        setReferenceWordCount(text.split(" ").length);
        setUserText(""); // Reset user text
        setWordAccuracy(null); // Reset accuracy
        setSpokenWordCount(0); // Reset spoken word count
        setFeedback(""); // Reset feedback
    };

    const startRecognition = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserText(transcript);
            calculateWordAccuracy(referenceText, transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setFeedback("Oops! Something went wrong. Please try again.");
        };
    };

    const calculateWordAccuracy = (reference, spoken) => {
        const referenceWords = reference.split(" ");
        const userWords = spoken.split(" ");
        let totalMatchedWords = 0;

        userWords.forEach(word => {
            if (referenceWords.includes(word)) {
                totalMatchedWords += 1;
            }
        });

        const accuracy = (totalMatchedWords / referenceWords.length) * 100;
        setWordAccuracy(accuracy.toFixed(2));
        setSpokenWordCount(userWords.length);

        // Provide feedback based on accuracy
        if (accuracy >= 90) {
            setFeedback("Wow! You did an amazing job! 🎉");
        } else if (accuracy >= 70) {
            setFeedback("Great effort! Keep practicing! 👍");
        } else {
            setFeedback("Good try! Let's try again! 😊");
        }
    };

    const handleNext = () => {
        if (referenceTexts.length === 0) return; // No texts available
        const nextIndex = (currentIndex + 1) % referenceTexts.length;
        setCurrentIndex(nextIndex);
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <Tool>
            <div className="p-6 max-w-md mx-auto text-center bg-gradient-to-b from-purple-200 to-violet-300 rounded-3xl shadow-xl border-4 border-violet-400 relative">

                <Link
                    href={"/"}
                    className="flex items-center absolute left-2 top-2 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <h1 className="text-4xl font-extrabold text-violet-800 mb-4 drop-shadow-md">🎤 Speech Fun </h1>
                <p className="text-lg text-gray-900">Try to say this sentence:</p>
                <p className="mt-3 text-2xl font-bold text-white bg-violet-600 p-3 rounded-lg inline-block shadow-md">
                    "{referenceText}"
                </p>

                <button
                    onClick={startRecognition}
                    className="mt-6 px-8 py-4 bg-purple-600 text-white rounded-full text-2xl shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105">
                    🎙️ Start Speaking
                </button>

                {userText && (
                    <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border-2 border-violet-400">
                        <p className="text-xl font-semibold text-purple-700">You said:</p>
                        <p className="text-lg font-bold text-violet-700 bg-purple-200 p-2 rounded-lg inline-block mt-2">{userText}</p>

                        <div className="flex justify-center mt-4">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="lightgray" strokeWidth="10" fill="none" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="violet"
                                        strokeWidth="10"
                                        strokeDasharray={`${wordAccuracy * 2.5}, 250`}
                                        fill="none"
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <span className="absolute text-xl font-bold text-purple-800">{wordAccuracy}%</span>
                            </div>
                        </div>

                        <p className="text-lg mt-3"><strong>Total words spoken:</strong> <span className="text-purple-600">{spokenWordCount}</span></p>
                        <p className="text-lg"><strong>Words in reference text:</strong> <span className="text-violet-600">{referenceWordCount}</span></p>

                        {feedback && (
                            <p className="mt-4 text-xl font-bold text-white bg-purple-600 p-3 rounded-xl shadow-md">
                                {feedback}
                            </p>
                        )}
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={referenceTexts.length === 0}
                    className="mt-6 px-8 py-4 bg-violet-600 text-white rounded-full text-2xl shadow-lg hover:bg-violet-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Next Test ➡️
                </button>
            </div>
        </Tool>

    );
}