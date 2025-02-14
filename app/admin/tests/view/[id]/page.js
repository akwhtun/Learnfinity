'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTest } from '../../libs/fetcher';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Link from 'next/link';

export default function TestList({params}) {
    const {id} = React.use(params)
    const [test, setTest] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const levelStyle = {
        "basic": "bg-blue-100 border-blue-400",
        "intermediate": "bg-green-100 border-green-400",
        "advance": "bg-orange-100 border-orange-400",
    };
let cardStyle;
let levelType;
    useEffect(() => {
        async function fetchOneTest() {
            try {
                setLoading(true)
                const data = await fetchTest(id)
                setTest(data.test);
                 levelType = data.level || "Unknown level";
                cardStyle = levelStyle[levelType] || "bg-gray-100 border-gray-400";
                
            } catch (error) {
                setError('Error fetching test:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOneTest();
    }, []);


    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {/* Back Button */}
        <Link href="/admin/tests">
        <button 
            className="absolute top-20 left-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
            ⬅ Back
        </button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">View Test</h1>

        <motion.div
            className={`max-w-3xl w-full shadow-lg rounded-xl overflow-hidden border ${cardStyle} p-6`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Activity Image */}
            {test.image && (
                <img
                    src={`/uploads/tests/${test.image}`}
                    alt={test.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            <h2 className="text-2xl font-semibold text-gray-900">{test.title}</h2>
            
            <div className="mt-4">
                <p className="text-gray-700 leading-relaxed"><strong>Description:</strong> {test.description}</p>
            </div>

            <div className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Category:</span> {test.category}
            </div>
            <div className="mt-1 text-sm text-gray-700">
                <span className="font-semibold">Level:</span> {levelType}
            </div>

            {/* <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(activity.createdAt).toLocaleDateString()}
            </div> */}
        </motion.div>
    </div>
    );
}
