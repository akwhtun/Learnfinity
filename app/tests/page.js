"use client";
import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchTests } from "../admin/tests/libs/fetcher";
import Loading from "../loading/page";
import Error from "../admin/error/page";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Tool from "../components/Tool";
import { categories } from "../admin/component/Categories";
import { levels } from "../admin/component/Levels";
import {TrophyIcon} from "@heroicons/react/24/solid";

export default function TestListPage() {
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState("")
    const [filterLevel, setFilterLevel] = useState("")
    const [filterCategory, setFilterCategory] = useState("")

    const filteredTests = tests && tests.filter(test => (test.title.toLowerCase().includes(searchTerm.toLowerCase()) || test.description.toLowerCase().includes(searchTerm.toLowerCase())) && (filterCategory ? test.category === filterCategory : true) && (filterLevel ? test.level === filterLevel : true))

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
            <div className="min-h-screen px-8 py-5 bg-gradient-to-br from-violet-900 via-purple-900 to-violet-900">
                {/* Header Section */}
                <div className="relative">
                    <Link
                        href={"/"}
                        className="absolute left-0 top-0 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h1 className="md:text-4xl text-2xl font-bold text-violet-200 text-center mb-8 md:me-0 me-6">
                        Choose a Test 🧠
                    </h1>
                    <Link
                        href={"/tests/rank"}
                        className="absolute flex right-0 top-0 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                    >
                        <TrophyIcon className="w-6 h-6" /> Ranks
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search tests..."
                        className="w-full md:w-1/2 p-3 rounded-lg border border-violet-400 bg-white/20 text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Category Filter */}
                    <select
                        className="p-3 rounded-lg border border-violet-400 bg-purple-500  text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Level Filter */}
                    <select
                        className="p-3 rounded-lg border border-violet-400 bg-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                    >
                        <option value="">All Levels</option>
                        {levels.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtered Tests */}
                {filteredTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {filteredTests.map((test) => (
                            <motion.div
                                key={test.id}
                                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-violet-500/30"
                            >
                                {/* Test Image */}
                                <img
                                 src={`/uploads/tests/${test.image}`}
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

                                    {/* Quizzes Section */}
                                    {test?.Quizes.length > 0 && (
                                        <div className="flex items-center text-violet-100 mb-2">
                                            <Link
                                                href={`/tests/puzzle/${test.id}`}
                                                className="flex items-center hover:text-violet-300 transition"
                                            >
                                                <span className="mr-2">📝</span>
                                                <span>
                                                    {test?.Quizes?.length > 1
                                                        ? `${test.Quizes.length} Quizzes`
                                                        : `${test.Quizes?.length || 0} Quiz`}
                                                </span>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Multiple Choice Section */}
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