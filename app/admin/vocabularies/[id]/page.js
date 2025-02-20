"use client"

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Alert from "@/app/components/Alter";
import { createVocabulary } from "../libs/fetcher";
import { fetchActivities } from "../../activities/libs/fetcher";

export default function AddVocabulary({params}) {

    const {id} = React.use(params)
    const [activities, setActivities] = useState([])
    const [englishWord, setEnglishWord] = useState("");
    const [myanmarMeaning, setMyanmarMeaning] = useState("");
    const [emoji, setEmoji] = useState("")
    const [speech, setSpeech] = useState("")
    const [activityId, setActivityId] = useState(id)
    const [loading, setLoading] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        async function fetchAllActivities() {
            const data = await fetchActivities()
            setActivities(data.activities)
        }
        fetchAllActivities()
    }, [])

    const handleShowAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const newVocabulary = await createVocabulary(englishWord, myanmarMeaning, emoji, speech, activityId);
            setAlertMessage(newVocabulary.message);
            handleShowAlert("success", newVocabulary.message)
        } catch (error) {
            handleShowAlert("error", "Error creating vocabulary:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="mt-24">
            <Link
                href="/admin/activities"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Vocabularies</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">English Word : </label>
                        <input
                            type="text"
                            value={englishWord}
                            onChange={(e) => setEnglishWord(e.target.value)}
                            placeholder="Enter english word"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Myanmar Meaning : </label>
                        <textarea
                            value={myanmarMeaning}
                            onChange={(e) => setMyanmarMeaning(e.target.value)}
                            placeholder="Enter myanmar meaning"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Emoji : </label>
                        <textarea
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            placeholder="Enter emoji"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Speech : </label>
                        <textarea
                            value={speech}
                            onChange={(e) => setSpeech(e.target.value)}
                            placeholder="Enter speech"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="activitySelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Activity
                        </label>

                        <select
                            id="activitySelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={activityId} 
                            onChange={(e) => setActivityId(e.target.value)} 
                            required
                        >
                            <option value="">Select an activity</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.title}
                                </option>
                            ))}
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform">
                        🚀 Add Vocabulary
                    </button>
                </form>
            </div>
        </div>
    );
}
