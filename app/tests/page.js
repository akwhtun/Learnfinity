"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const tests = [
    {
        id: 1,
        title: "Animal Vocabulary",
        description: "Test your knowledge of animal names and spellings.",
        quizCount: 10,
        image: "/images/animals.jpg",
    },
    {
        id: 2,
        title: "Fruits and Vegetables",
        description: "Learn the names of common fruits and vegetables.",
        quizCount: 8,
        image: "/images/fruits.jpg",
    },
    {
        id: 3,
        title: "Colors and Shapes",
        description: "Identify colors and shapes in English.",
        quizCount: 12,
        image: "/images/colors.jpg",
    },
    {
        id: 4,
        title: "Daily Objects",
        description: "Name everyday objects around you.",
        quizCount: 15,
        image: "/images/objects.jpg",
    },
];

export default function TestListPage() {
    const router = useRouter();

    const handleTestClick = (testId) => {
        router.push(`/tests/${testId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
            <h1 className="text-4xl font-bold text-purple-800 text-center mb-8">
                Choose a Test 🧠
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {tests.map((test) => (
                    <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleTestClick(test.id)}
                    >
                        {/* Test Image */}
                        <img
                            src={test.image}
                            alt={test.title}
                            className="w-full h-48 object-cover"
                        />

                        {/* Test Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-purple-800 mb-2">
                                {test.title}
                            </h2>
                            <p className="text-gray-600 mb-4">{test.description}</p>
                            <div className="flex items-center text-gray-700">
                                <span className="mr-2">📝</span>
                                <span>{test.quizCount} Quizzes</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}