'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchActivity } from '../../libs/fetcher';
import { updateActivity } from '../../libs/fetcher';
import { fetchLessons } from '@/app/admin/lessons/libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function EditActivity({ params }) {
    const { id } = React.use(params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [selectedLessonId, setSelectedLessonId] = useState('')
    const [lessons, setLessons] = useState([])
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
        const fetchAllLessons = async () => {
            try {
                const data = await fetchLessons();
                setLessons(data.lessons);
            } catch (error) {
                setError("Error fetching lessons:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllLessons();
    }, []);

    useEffect(() => {
        const fetchOneActivity = async () => {
            try {
                setLoading(true)
                const data = await fetchActivity(id);
                setTitle(data.activity.title)
                setDescription(data.activity.description)
                setContent(data.activity.content)
                setImage(data.activity.image)
                setSelectedLessonId(data.activity.lessonId)
            } catch (error) {
                setError("Error fetching activity:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneActivity();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData();
            formData.append("id", id)
            formData.append("title", title);
            formData.append("description", description);
            formData.append("content", content);
            formData.append("lessonId", selectedLessonId);
            if (image) {
                formData.append("image", image);
            }

            const updatedLesson = await updateActivity(formData)
            handleShowAlert("success", updatedLesson.message)
        } catch (error) {
            handleShowAlert("error", "Error creating lesson:", error.message || error);
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
                    href="/admin/activities"
                    className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Activity
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Activity</h2>

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

                    <div>
                        <label className="block text-gray-700 font-medium">Content</label>
                        <textarea
                            value={content || ""}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows="4"
                            required
                        ></textarea>
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
                            src={`/uploads/activities/${image}`}
                            alt={title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />)}
                    </div>

                    <select
                        id="lessonSelect"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={selectedLessonId} 
                        onChange={(e) => selectedLessonId(e.target.value)} // Handle change
                    >
                        <option value="">Select a Lesson</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id} >
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
                        Update Lesson
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
