'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchText } from '../../libs/fetcher';
import { updateText } from '../../libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function EditText({ params }) {
    const { id } = React.use(params);
    const [text, setText] = useState('')
    const [image, setImage] = useState('')
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
        const fetchOneText = async () => {
            try {
                setLoading(true)
                const data = await fetchText(id);
                setText(data.pronounciation.text)
                setImage(data.pronounciation.image)
            } catch (error) {
                setError("Error fetching text:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneText();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData();
            formData.append("id", id)
            formData.append("text", text);
            if (image) {
                formData.append("image", image);
            }
            const updatedText = await updateText(formData)
            handleShowAlert("success", updatedText.message)
        } catch (error) {
            handleShowAlert("error", "Error creating text:", error.message || error);
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
        <div className="min-h-screen  flex items-center justify-center bg-gray-100 p-4">
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
                    href="/admin/pronounciations"
                    className="px-4 py-2  w-64 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Pronounciation
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Pronounciation</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Text</label>
                        <input
                            type="text"
                            value={text || ""}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>
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
                                src={`/uploads/pronounciations/${image}`}
                                alt={text}
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
                        Update Pronounciation
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
