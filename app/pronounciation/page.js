'use client'

import { useState } from 'react';

export default function SpeechRecognitionApp() {
    const referenceText = "The lazy dog is sleeping under the tree and he wants to eat something now";
    const [userText, setUserText] = useState("");
    const [wordAccuracy, setWordAccuracy] = useState(null);
    const [spokenWordCount, setSpokenWordCount] = useState(0);
    const [referenceWordCount, setReferenceWordCount] = useState(referenceText.split(" ").length);

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
    };

    return (
        <div className="p-5 max-w-lg mx-auto text-center">
            <h1 className="text-xl font-bold">Speech Recognition</h1>
            <p className="mt-2">Reference: "{referenceText}"</p>
            <button
                onClick={startRecognition}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Start Speaking
            </button>
            {userText && (
                <div className="mt-4">
                    <p><strong>You said:</strong> {userText}</p>
                    <p><strong>Exact word match accuracy:</strong> {wordAccuracy}%</p>
                    <p><strong>Total words spoken:</strong> {spokenWordCount}</p>
                    <p><strong>Total words in reference text:</strong> {referenceWordCount}</p>
                </div>
            )}
        </div>
    );
}