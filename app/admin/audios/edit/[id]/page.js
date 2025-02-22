"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchAudio } from '../../libs/fetcher';
import { updateAudio } from '../../libs/fetcher';
import { fetchLessons } from '@/app/admin/lessons/libs/fetcher';
import Link from 'next/link';
import Alert from '@/app/components/Alter';
export default function EditAudio({ params }) {
    const { id } = React.use(params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [audio, setAudio] = useState(null); // Updated to handle audio file
    const [image, setImage] = useState(null); // New state for image file
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
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
        const fetchAllLessons = async () => {
            try {
                const data = await fetchLessons();
                setLessons(data.lessons);
            } catch (error) {
                setError(`Error fetching lessons: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchAllLessons();
    }, []);

    useEffect(() => {
        const fetchOneAudio = async () => {
            try {
                setLoading(true);
                const data = await fetchAudio(id); // Fetch audio instead of activity
                setTitle(data.audio.title);
                setDescription(data.audio.description);
                setAudio(data.audio.audio); // Set the audio file path
                setImage(data.audio.image); // Set the image file path
                setSelectedLessonId(data.audio.lessonId);
            } catch (error) {
                setError(`Error fetching audio: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchOneAudio();
    }, [id]);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const formData = new FormData();
            formData.append("id", id);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("lessonId", selectedLessonId);
            if (audio instanceof File) { // Append audio only if it's a new file
                formData.append("audio", audio);
            }
            if (image instanceof File) { // Append image only if it's a new file
                formData.append("image", image);
            }

            const updatedAudio = await updateAudio(formData); // Update audio instead of activity
            handleShowAlert("success", updatedAudio.message);
        } catch (error) {
            handleShowAlert("error", `Error updating audio: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error error={error} />;
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
                <Link
                    href="/admin/audios"
                    className="px-4 py-2 w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Audios
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Audio</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Title</label>
                        <input
                            type="text"
                            value={title || ""}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description || ""}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    {/* Audio Upload */}
                    <div>
                        <label className="block text-gray-700 font-medium">Audio File</label>
                        <input
                            type="file"
                            accept="audio/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setAudio(e.target.files[0])} // Set the audio file
                        />
                        {audio && !(audio instanceof File) && ( // Display audio player if audio is not a new file
                            <div className="mt-4">
                                <audio controls className="w-full">
                                    <source src={`/uploads/audios/${audio}`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 font-medium">Image File</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setImage(e.target.files[0])} // Set the image file
                        />
                        {image && !(image instanceof File) && ( // Display image if it's not a new file
                            <div className="mt-4">
                                <img
                                    src={`/uploads/audioImages/${image}`}
                                    alt={title}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Lesson Select */}
                    <select
                        id="lessonSelect"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        required
                    >
                        <option value="">Select a Lesson</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.title}
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
                        Update Audio
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}