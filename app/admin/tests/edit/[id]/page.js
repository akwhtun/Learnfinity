'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchTest } from '../../libs/fetcher';
import { updateTest } from '../../libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';
import { levels } from '@/app/admin/component/Levels';
import { categories } from '@/app/admin/component/Categories';

export default function EditTest({ params }) {
    const { id } = React.use(params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('')
    const [category, setCategory] = useState('')
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
        const fetchOneTest = async () => {
            try {
                setLoading(true)
                const data = await fetchTest(id);
                setTitle(data.test.title)
                setDescription(data.test.description)
                setLevel(data.test.level)
                setCategory(data.test.category)
                setImage(data.test.image)
            } catch (error) {
                setError("Error fetching test:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneTest();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData();
            formData.append("id", id)
            formData.append("title", title);
            formData.append("description", description);
            formData.append("level", level);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }

            const updatedTest = await updateTest(formData)
            handleShowAlert("success", updatedTest.message)
        } catch (error) {
            handleShowAlert("error", "Error updating test:", error.message || error);
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
                    href="/admin/tests"
                    className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
                >
                    Back to Test
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Test</h2>

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
                        id="levelSelect"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={level} 
                        onChange={(e) => setLevel(e.target.value)} // Handle change
                    >
                        <option value="">Select a level</option>
                        {levels.map((level, index) => (
                            <option key={index} value={level} >
                                {level}
                            </option>
                        ))}
                    </select>

                    <select
                        id="categorySelect"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} // Handle change
                    >
                        <option value="">Select a category</option>
                        {categories.map((category,index) => (
                            <option key={index} value={category} >
                                {category}
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
                            src={`/uploads/tests/${image}`}
                            alt={title}
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
                        Update Test
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
