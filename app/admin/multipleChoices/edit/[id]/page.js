'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Alert from '@/app/components/Alter';
import Link from 'next/link';
import { fetchMultipleChoice, updatedMultipleChoice } from '../../libs/fetcher';
import { fetchTests } from '@/app/admin/tests/libs/fetcher';

export default function EditTest({ params }) {
    const { id } = React.use(params);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [otherWords, setOtherWords] = useState('')
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
                setError(`Error fetching test: ${error.message || error}`);

            } finally {
                setLoading(false);
            }
        };
        fetchAllTests();
    }, []);

    useEffect(() => {
        const fetchOneMultipleChoice = async () => {
            try {
                setLoading(true)
                const data = await fetchMultipleChoice(id);
                setQuestion(data.multipleChoice.question)
                setAnswer(data.multipleChoice.answer)
                setOtherWords(data.multipleChoice.otherWords)
                setSelectedTestId(data.multipleChoice.testId)
                setImage(data.multipleChoice.image)
                
            } catch (error) {
                setError(`Error fetching multipleChoice: ${error.message || error}`);

            } finally {
                setLoading(false);
            }
        };
        fetchOneMultipleChoice();
    }, [id]);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData();
            formData.append("id", id)
            formData.append("question", question);
            formData.append("answer", answer);
            formData.append("otherWords", otherWords);
            formData.append("testId", selectedTestId);
            if (image) {
                formData.append("image", image);
            }

            const updateMultipleChoice = await updatedMultipleChoice(formData)
            handleShowAlert("success", updateMultipleChoice.message)
        } catch (error) {
            handleShowAlert("error", "Error updating multipleChoice:", error.message || error);
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
                    href="/admin/multipleChoices"
                    className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to MultipleChoice
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit MultipleChoice</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Question</label>
                        <textarea
                            value={question || ""}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Answer</label>
                        <input
                            type="text"
                            value={answer || ""}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">OtherWords</label>
                        <input
                            type="text"
                            value={otherWords || ""}
                            onChange={(e) => setOtherWords(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

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
                                src={`/uploads/multipleChoices/${image}`}
                                alt={answer}
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
                        Update MultipleChoice
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
