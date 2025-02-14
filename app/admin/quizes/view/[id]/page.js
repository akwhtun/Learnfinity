'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loading from '@/app/loading/page';
import Error from '@/app/admin/error/page';
import Link from 'next/link';
import { fetchQuiz } from '../../libs/fetcher';

export default function QuizList({params}) {
    const {id} = React.use(params)
    const [quiz, setQuiz] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")


    useEffect(() => {
        async function fetchOneQuiz() {
            try {
                setLoading(true)
                const data = await fetchQuiz(id)
                setQuiz(data.quiz); 
            } catch (error) {
                setError('Error fetching quiz:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOneQuiz();
    }, []);


    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {/* Back Button */}
        <Link href="/admin/quizes">
        <button 
            className="absolute top-20 left-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
            ⬅ Back
        </button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">View Quiz</h1>

        <motion.div
            className={`max-w-3xl w-full shadow-lg rounded-xl overflow-hidden  p-6`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* quiz Image */}
            {quiz.image && (
                <img
                    src={`/uploads/quizes/${quiz.image}`}
                    alt={quiz.sentence}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            {/* quiz Info */}
            <h2 className="text-2xl font-semibold text-gray-900">{quiz.sentence}</h2>
            <h2 className="text-2xl font-semibold text-gray-900">{quiz.quizWord}</h2>
            
            <div className="mt-4">
                <p className="text-gray-700 leading-relaxed"><strong>WordSplit:</strong> {quiz.wordSplit == 1 ?"Yes" : "No"}</p>
            
            </div>

            <div className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Test:</span> {quiz.Test?.title}
            </div>
          
{/* 
            <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(quiz.createdAt).toLocaleDateString()}
            </div> */}
        </motion.div>
    </div>
    );
}
