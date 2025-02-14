"use client";
import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchTests } from "../admin/tests/libs/fetcher";
import Loading from "../loading/page";
import Error from "../admin/error/page";
import Link from "next/link";
import Tool from "../components/Tool";

export default function TestListPage() {
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAllTests = async () => {
            try {
                setLoading(true)
                const data = await fetchTests();
                setTests(data.tests);
            } catch (error) {
                setError("Error fetching tests:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTests();
    }, []);

    if (loading) {
        return (<Loading />)
    }
    if (error) {
        return (<Error error={error} />
        )
    }

    return (
        <Tool>
        <div className="min-h-screen p-8 bg-gradient-to-br from-violet-900 via-purple-900 to-violet-900">
            <h1 className="text-4xl font-bold text-violet-200 text-center mb-8">
                Choose a Test 🧠
            </h1>
    
            {tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {tests.map((test) => (
                        <motion.div
                            key={test.id}
                            className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-violet-500/30 "
                        >
                            {/* Test Image */}
                            <img
                                src={test.image}
                                alt={test.title}
                                className="w-full h-48 object-cover"
                            />
    
                            {/* Test Content */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-violet-200 mb-2">
                                    {test.title}
                                </h2>
                                <p className="text-violet-100 mb-4">{test.description}</p>
                                <p className="text-violet-100 mb-4">
                                    <strong>Level:</strong> {test.level}
                                </p>
                                <p className="text-violet-100 mb-4">
                                    <strong>Category:</strong> {test.category}
                                </p>
    
                                {/* Quizes Section */}
                                {test?.Quizes.length > 0 && (
                                    <div className="flex items-center text-violet-100 mb-2">
                                        <Link
                                            href={`/tests/puzzle/${test.id}`}
                                            className="flex items-center hover:text-violet-300 transition"
                                        >
                                            <span className="mr-2">📝</span>
                                            <span>
                                                {test?.Quizes?.length > 1
                                                    ? `${test.Quizes.length} Quizes`
                                                    : `${test.Quizes?.length || 0} Quiz`}
                                            </span>
                                        </Link>
                                    </div>
                                )}
    
                                {/* Multiple Choices Section */}
                                {test?.MultipleChoices.length > 0 && (
                                    <div className="flex items-center text-violet-100">
                                        <Link
                                            href={`/tests/multipleChoice/${test.id}`}
                                            className="flex items-center hover:text-violet-300 transition"
                                        >
                                            <span className="mr-2">🔘</span>
                                            <span>
                                                {test?.MultipleChoices?.length > 1
                                                    ? `${test.MultipleChoices.length} Multiple Choices`
                                                    : `${test.MultipleChoices?.length} Multiple Choice`}
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-2xl text-center text-red-400">No test found...</div>
            )}
        </div>
    </Tool>
    );
}