'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loading from '../loading/page';
import Error from '../error/page';
import Sidebar from '../component/Sidebar';
import Alert from '@/app/components/Alter';
import { fetchAudios } from './libs/fetcher';
import { deleteAudio } from './libs/fetcher';
import Link from 'next/link';

export default function AudioList() {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
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
        async function fetchAllAudios() {
            try {
                setLoading(true);
                const data = await fetchAudios(); // Fetch audios instead of activities
                setAudios(data.audios);
            } catch (error) {
                setError(`Error fetching audios: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        }
        fetchAllAudios();
    }, []);

    const handleDeleteAudio = async (id) => {
        try {
            const data = await deleteAudio(id); // Delete audio instead of activity
            setAudios(audios.filter((audio) => audio.id !== id));
            handleShowAlert("success", data.message);
        } catch (error) {
            handleShowAlert("error", `Error deleting audio: ${error.message || error}`);
        }
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Audio Management</h2>
                    <Link href="/admin/audios/add" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
                        Add New Audio
                    </Link>
                </div>

                {audios.length === 0 ? (
                    <p className="text-gray-500 text-center">No audios found.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {audios.map((audio) => {
                            const skillType = audio.lesson?.skill?.title || "Unknown Skill";

                            // Unique styles based on skill type
                            const skillStyles = {
                                "Listening": "bg-blue-100 border-blue-400",
                                "Reading": "bg-green-100 border-green-400",
                                "Writing": "bg-orange-100 border-orange-400",
                                "Speaking": "bg-purple-100 border-purple-400"
                            };

                            const cardStyle = skillStyles[skillType] || "bg-gray-100 border-gray-400";

                            return (
                                <motion.div
                                    key={audio.id}
                                    className={`shadow-lg rounded-lg overflow-hidden p-4 border ${cardStyle} hover:shadow-2xl transition`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {audio.image && (
                                        <img
                                            src={`/uploads/audioImages/${audio.image}`}
                                            alt={audio.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-800">{audio.title}</h2>
                                    <p className="text-gray-600 mt-2">{audio.description.slice(0, 40)}...</p>

                                    {/* Audio Player */}
                                    <div className="mt-4">
                                        <audio controls className="w-full">
                                            <source src={`/uploads/audios/${audio.audio}`} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>

                                    <div className="mt-4 text-sm text-gray-700">
                                        <span className="font-semibold">Lesson:</span> {audio.lesson?.title}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <span className="font-semibold">Skill:</span> {skillType}
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">
                                        Created: {new Date(audio.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="mt-4">
                                        <Link href={`/admin/audios/edit/${audio.id}`} className="px-5 py-3 mx-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>

                                        <button onClick={() => handleDeleteAudio(audio.id)} className="px-4 py-2 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}