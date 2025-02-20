'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchActivities } from '@/app/admin/activities/libs/fetcher';
import { fetchVocabulary } from '../../libs/fetcher';
import { updateVocabulary } from '../../libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function EditVocabulary({ params }) {
    const { id } = React.use(params);
    const [activities, setActivities] = useState([])
    const [englishWord, setEnglishWord] = useState("");
    const [myanmarMeaning, setMyanmarMeaning] = useState("");
    const [emoji, setEmoji] = useState("")
    const [speech, setSpeech] = useState("")
    const [selectedActivityId, setSelectedActivityId] = useState("")
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
        const fetchAllActivities = async () => {
            try {
                const data = await fetchActivities();
                setActivities(data.activities);
            } catch (error) {
                setError("Error fetching activities:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllActivities();
    }, []);

    useEffect(() => {
        const fetchOneVocabulary = async () => {
            try {
                setLoading(true)
                const data = await fetchVocabulary(id);
                setEnglishWord(data.vocabulary.englishWord)
                setMyanmarMeaning(data.vocabulary.myanmarMeaning)
                setEmoji(data.vocabulary.emoji)
                setSpeech(data.vocabulary.speech)
                setSelectedActivityId(data.vocabulary.activity.id)
            } catch (error) {
                setError("Error fetching vocabulary:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneVocabulary();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const updatedVocabulary = await updateVocabulary(id, englishWord, myanmarMeaning, speech, emoji, selectedActivityId)
            handleShowAlert("success", updatedVocabulary.message)
        } catch (error) {
            handleShowAlert("error", "Error updating vocabulary:", error.message || error);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6"
            >
                <p
                    onClick={()=>history.back()}
                    className="px-4 py-2  w-60 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Vocabulary
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Vocabulary</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">English Word</label>
                        <input
                            type="text"
                            value={englishWord || ""}
                            onChange={(e) => setEnglishWord(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Myanmar Meaning</label>
                        <input
                            type="text"
                            value={myanmarMeaning || ""}
                            onChange={(e) => setMyanmarMeaning(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Emoji</label>
                        <input
                            type="text"
                            value={emoji || ""}
                            onChange={(e) => setEmoji(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Speech</label>
                        <input
                            type="text"
                            value={speech || ""}
                            onChange={(e) => setSpeech(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <select
                        id="activitySelected"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={selectedActivityId}
                        onChange={(e) => setSelectedActivityId(e.target.value)}
                    >
                        <option value="">Select a Activity</option>
                        {activities.map((activity) => (
                            <option key={activity.id} value={activity.id} >
                                {activity.title}
                            </option>
                        ))}
                    </select>

                    {/* Update Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
                    >
                        Update Vocabulary
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
