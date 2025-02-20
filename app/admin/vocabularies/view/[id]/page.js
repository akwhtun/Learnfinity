"use client"
import Link from "next/link";
import Sidebar from "@/app/admin/component/Sidebar";
import React, { useState, useEffect } from "react";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";
import { fetchActivityVocabularies } from "../../libs/fetcher";
import { deleteVocabulary } from "../../libs/fetcher";
import Alert from "@/app/components/Alter";

export default function ActivityVocabularies({ params }) {

    const { id } = React.use(params)
    const [vocabularies, setVocabularies] = useState([])
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
        const fetchAllActivityVocabularies = async () => {
            try {
                setLoading(true)
                const data = await fetchActivityVocabularies(id);
                setVocabularies(data.activityVocabularies);
            } catch (error) {
                setError(`Error fetching activity vocabularies:, ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchAllActivityVocabularies();
    }, []);

    const handleVocabularyDelete = async (id) => {
        try {
            const data = await deleteVocabulary(id);
            setVocabularies(vocabularies.filter((vocablary) => vocablary.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting vocabulary:", error.message || error);
        }
    }

    if (error) {
        return (<Error error={error} />)
    }

    if (loading) {
        return (<Loading />)
    }
    return (
        <div className="flex  min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && (
                    <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
                )}

                <div className="flex items-center justify-between mb-6">
                    <Link href="/admin/activities">
                        <button
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
                        >
                            Back
                        </button>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-800">Vocabulary For <span className="text-purple-700">{vocabularies[0]?.activity?.title}</span></h2>
                </div>
                {vocabularies.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
                            <tr>
                                <th className="p-4">English Word</th>
                                <th className="p-4">Myanmar Meaning</th>
                                <th className="p-4">Emoji</th>
                                <th className="p-4">Speech</th>
                                <th className="p-4">Activity Title</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vocabularies.map((vocablary, index) => (
                                <tr key={vocablary.id} className="border-b transition hover:bg-gray-100">
                                    <td className="p-4 font-semibold text-gray-800">{vocablary.englishWord}</td>
                                    <td className="p-4 text-gray-600">{vocablary.myanmarMeaning}</td>
                                    <td className="p-4 text-gray-600">{vocablary.emoji}</td>
                                    <td className="p-4 text-gray-700">{vocablary.speech}</td>
                                    <td className="p-4 text-gray-700">{vocablary.activity.title}</td>
                                    <td className="p-4 text-center flex justify-center gap-3">
                                        <Link href={`/admin/vocabularies/edit/${vocablary.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleVocabularyDelete(vocablary.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div className="text-xl text-center mt-9">
                    No vocabulary found...
                </div>)}

            </div>
        </div>

    );
}
