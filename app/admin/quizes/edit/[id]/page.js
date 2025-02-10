'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Alert from '@/app/components/Alter';
import Link from 'next/link';
import { fetchQuiz, updatedQuiz } from '../../libs/fetcher';
import { fetchTests } from '@/app/admin/tests/libs/fetcher';

export default function EditTest({ params }) {
    const { id } = React.use(params);

    const [sentence, setSentence] = useState('');
    const [quizWord, setQuizWord] = useState('');
    const [wordSplit, setWordSplit] = useState('')
    const [selectedTestId, setSelectedTestId] = useState('')
    const [image, setImage] = useState('')
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const handleShowAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    useEffect(() => {
        const fetchAllTests = async () => {
            try {
                const data = await fetchTests();
                setTests(data.tests);
            } catch (error) {
                setError(`Error fetching quiz: ${error.message || error}`);

            } finally {
                setLoading(false);
            }
        };
        fetchAllTests();
    }, []);

    useEffect(() => {
        const fetchOneQuiz = async () => {
            try {
                setLoading(true)
                const data = await fetchQuiz(id);
                setSentence(data.quiz.sentence)
                setQuizWord(data.quiz.quizWord)
                setWordSplit(data.quiz.wordSplit)
                setSelectedTestId(data.quiz.testId)
                setImage(data.quiz.image)
                
            } catch (error) {
                setError(`Error fetching quiz: ${error.message || error}`);

            } finally {
                setLoading(false);
            }
        };
        fetchOneQuiz();
    }, [id]);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData();
            formData.append("id", id)
            formData.append("sentence", sentence);
            formData.append("quizWord", quizWord);
            formData.append("wordSplit", wordSplit);
            formData.append("testId", selectedTestId);
            if (image) {
                formData.append("image", image);
            }

            const updateQuiz = await updatedQuiz(formData)
            handleShowAlert("success", updateQuiz.message)
        } catch (error) {
            handleShowAlert("error", "Error updating test:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<Loading />)
    }

    if (error) {
        return (<Error error={error} />)
    }

    

    return (
        <div className="min-h-screen mt-16 flex items-center justify-center bg-gray-100 p-4">
            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6"
            >
                <Link
                    href="/admin/quizes"
                    className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Quiz
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Quiz</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Sentence</label>
                        <textarea
                            value={sentence || ""}
                            onChange={(e) => setSentence(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Quiz Word</label>
                        <input
                            type="text"
                            value={quizWord || ""}
                            onChange={(e) => setQuizWord(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <select
                        id="wordSplit"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={wordSplit}
                        onChange={(e) => setWordSplit(e.target.value)} // Handle change
                    >
                        <option value="">Define word split or not</option>
                        <option value={1}>
                            Split Word
                        </option>
                        <option value={0}>
                            Not Split Word
                        </option>
                    </select>

                    <select
                        id="testSelected"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={selectedTestId}
                        onChange={(e) => setSelectedTestId(e.target.value)} // Handle change
                    >
                        <option value="">Select a test</option>
                        {tests.map((test, index) => (
                            <option key={index} value={test.id} >
                                {test.title}
                            </option>
                        ))}
                    </select>

                    <div>
                        <label className="block text-gray-700 font-medium">Image (URL)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && (
                            <img
                                src={`/uploads/quizes/${image}`}
                                alt={sentence}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />)}
                    </div>

                    {/* Update Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
                    >
                        Update Quiz
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
