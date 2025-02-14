'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchActivity } from '../../libs/fetcher';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Link from 'next/link';
export default function ActivityList({params}) {
    const {id} = React.use(params)
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    // Unique styles based on skill type
const skillStyles = {
    "Listening": "bg-blue-100 border-blue-400",
    "Reading": "bg-green-100 border-green-400",
    "Writing": "bg-orange-100 border-orange-400",
    "Speaking": "bg-purple-100 border-purple-400"
};
let cardStyle;
let skillType;
    useEffect(() => {
        async function fetchOneActivity() {
            try {
                setLoading(true)
                const data = await fetchActivity(id)
                setActivity(data.activity);
                 skillType = data.activity.lesson?.skill?.title || "Unknown Skill";
                cardStyle = skillStyles[skillType] || "bg-gray-100 border-gray-400";
                
            } catch (error) {
                setError('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOneActivity();
    }, []);


    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex flex-col  items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {/* Back Button */}
        <Link href="/admin/activities">
        <button 
            className="absolute top-20 left-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
            ⬅ Back
        </button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">View Activity</h1>

        <motion.div
            className={`max-w-3xl w-full shadow-lg rounded-xl overflow-hidden border ${cardStyle} p-6`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Activity Image */}
            {activity.image && (
                <img
                    src={`/uploads/activities/${activity.image}`}
                    alt={activity.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            {/* Activity Info */}
            <h2 className="text-2xl font-semibold text-gray-900">{activity.title}</h2>
            
            <div className="mt-4">
                <p className="text-gray-700 leading-relaxed"><strong>Description:</strong> {activity.description}</p>
                <p className="text-gray-700 leading-relaxed mt-2"><strong>Content:</strong> {activity.content}</p>
            </div>

            <div className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Lesson:</span> {activity.lesson?.title}
            </div>
            <div className="mt-1 text-sm text-gray-700">
                <span className="font-semibold">Skill:</span> {skillType}
            </div>

            <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(activity.createdAt).toLocaleDateString()}
            </div>
        </motion.div>
    </div>
    );
}
