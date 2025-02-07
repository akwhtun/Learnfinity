'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchLesson, updateLesson } from '../../libs/fetcher';
import { fetchSkills } from '@/app/admin/skills/libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function EditLesson({ params }) {
    const { id } = React.use(params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillId, setSkillId] = useState('')
    const [skills, setSkills] = useState([])
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
            const fetchAllSkills = async () => {
                try {
                    setLoading(true)
                    const data = await fetchSkills();
                    setSkills(data.skills);
                } catch (error) {
                    setError("Error fetching skills:", error.message || error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllSkills();
        }, []);


    useEffect(() => {
        const fetchOneLesson = async () => {
            try {
                setLoading(true)
                const data = await fetchLesson(id);
                setTitle(data.lesson.title)
                setDescription(data.lesson.description)
                setSkillId(data.lesson.skillId)
            } catch (error) {
                setError("Error fetching lesson:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneLesson();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const updatedLesson = await updateLesson(id, title, description, parseInt(skillId));
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
                    href="/admin/lessons"
                    className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Lessons
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Lesson</h2>

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

                    <select
                            id="skillSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={skillId} // Controlled component state
                            onChange={(e) => setSkillId(e.target.value)} // Handle change
                        >
                            <option value="">Select a Skill</option>
                            {skills.map((skill) => (
                                <option key={skill.id} value={skill.id} >
                                    {skill.title}
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
