'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import { fetchSkill,updateSkill } from '../../libs/fetcher';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function EditSkill({ params }) {
    const { id } = React.use(params);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState("");
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
        const fetchOneSkill = async () => {
            try {
                setLoading(true)
                const data = await fetchSkill(id);
                setTitle(data.skill.title)
                setDescription(data.skill.description)
            } catch (error) {
                setError("Error fetching skill:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchOneSkill();
    }, []);

    const handleUpdate = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const updatedSkill = await updateSkill(id, title, description);
            handleShowAlert("success", updatedSkill.message)
        } catch (error) {
            handleShowAlert("error", "Error creating skill:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<Loading />)
    }

    if(error){
        return (<Error error={error}/>)
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
                <Link href={"/admin/skills"}
                    
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <span className="mr-2">&larr;</span> Back
                </Link>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Skill</h2>

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
                            value={ description || ""}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    {/* Update Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition"
                    >
                        Update Skill
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
