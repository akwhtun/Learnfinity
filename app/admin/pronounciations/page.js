'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loading from '../loading/page';
import Error from '../error/page';
import Sidebar from '../component/Sidebar';
import Alert from '@/app/components/Alter';
import Link from 'next/link';
import { deleteText } from './libs/fetcher';
import { fetchAllTexts } from './libs/fetcher';

export default function ActivityList() {
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
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
        async function fetchAllPronounTexts() {
            try {
                setLoading(true)
                const data = await fetchAllTexts()
                setTexts(data.pronounciations);
            } catch (error) {
                setError('Error fetching pronounciations:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllPronounTexts();
    }, []);

    const handleTextDelete = async (id) => {
        try {
            const data = await deleteText(id);
            setTexts(texts.filter((text) => text.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting text:", error.message || error);
        }
    }

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex  min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Pronounciation Management</h2>
                    <Link href="/admin/pronounciations/add" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
                        Add New Pronounciation
                    </Link>
                </div>


                {texts.length === 0 ? (
                    <p className="text-gray-500 text-center">No texts found.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {texts.map((text) => {
                            return (
                                <motion.div
                                    key={text.id}
                                    className={`shadow-lg rounded-lg overflow-hidden p-4 border hover:shadow-2xl transition`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {text.image && (
                                        <img
                                            src={`/uploads/pronounciations/${text.image}`}
                                            alt={text.id}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <p className="text-gray-600 mt-2">{text.text}</p>
                                    <div className="mt-4 text-xs text-gray-500">
                                        Created: {new Date(text.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className='my-4'>
                                        <Link href={`/admin/pronounciations/edit/${text.id}`} className="px-5 py-3 mx-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>

                                        <button onClick={() => handleTextDelete(text.id)} className="px-4 py-2 mt-4  bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
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
