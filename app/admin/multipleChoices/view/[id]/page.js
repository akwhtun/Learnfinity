'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Link from 'next/link';
import { fetchMultipleChoice } from '../../libs/fetcher';

export default function MultipleChoiceList({params}) {
    const {id} = React.use(params)
    const [multipleChoice, setMultipleChoice] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")


    useEffect(() => {
        async function fetchOneMultipleChoice() {
            try {
                setLoading(true)
                const data = await fetchMultipleChoice(id)
                setMultipleChoice(data.multipleChoice); 
            } catch (error) {
                setError('Error fetching multipleChoice:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOneMultipleChoice();
    }, []);


    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {/* Back Button */}
        <Link href="/admin/activities">
        <button 
            className="absolute top-20 left-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
            ⬅ Back
        </button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">View MultipleChoice</h1>

        <motion.div
            className={`max-w-3xl w-full shadow-lg rounded-xl overflow-hidden  p-6`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* multipleChoice Image */}
            {multipleChoice.image && (
                <img
                    src={`/uploads/multipleChoices/${multipleChoice.image}`}
                    alt={multipleChoice.answer}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            {/* multipleChoice Info */}
            <h2 className="text-2xl font-semibold text-gray-900">{multipleChoice.question}</h2>
            
            <div className="mt-4">
                <p className="text-gray-700 leading-relaxed"><strong>Answer:</strong> {multipleChoice.answer}</p>
                <p className="text-gray-700 leading-relaxed mt-2"><strong>OtherWords:</strong> {multipleChoice.otherWords}</p>
            </div>

            <div className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Lesson:</span> {multipleChoice.Test?.title}
            </div>
          
{/* 
            <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(multipleChoice.createdAt).toLocaleDateString()}
            </div> */}
        </motion.div>
    </div>
    );
}
