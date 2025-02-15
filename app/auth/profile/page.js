"use client";
import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Tool from "@/app/components/Tool";
import { fetchUserScores } from "../libs/fetcher";
import Loading from "@/app/admin/loading/page";
import Error from "@/app/admin/error/page";
import { levelNames } from "@/app/admin/component/LevelNames";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function ProfilePage() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const [userScores, setUserScores] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        const fetchScores = async () => {
            try {
                if (!user?.id) return;
                setLoading(true)
                const data = await fetchUserScores(user?.id);
                setUserScores(data.userScores)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        user?.id && fetchScores()

    }, [user?.id])

    if (status === "loading") {
        return (<Loading />)
    }




    const userScore = userScores && userScores.reduce((acc, curr) => {
        acc += curr.score
        return acc;
    }, 0);

    console.log("user score is", userScore);



    // Determine the user's rank level
    const userRank = userScore && levelNames.find(
        (level) => userScore >= level.min && userScore <= level.max
    );

    // Calculate progress to the next rank level
    const progress = ((userScore - userRank.min) / (userRank.max - userRank.min)) * 100;

    if (loading) {
        return (<Loading />)
    }
    if (error) {
        return (<Error error={error} />)
    }
    return (
        <Tool>
            {user &&
                <div className="min-h-screen p-8">

                    <div className="relative">
                        <button onClick={()=>history.back()}
                            className="flex items-center absolute left-0 top-0 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl text-white font-bold text-center mb-4">User Profile</h1>
                    </div>
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`max-w-2xl mx-auto  rounded-xl shadow-lg p-8 ${userRank.color}`}
                    >
                        {/* User Details */}
                        <div className="text-center">
                            <img
                                src={user?.image || "/default-avatar.png"}
                                alt="User Profile"
                                className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
                            />
                            <h1 className="text-3xl font-bold text-white mt-4">{user?.name}</h1>
                            <p className="text-gray-200">{user?.email}</p>
                        </div>

                        {/* Rank Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 text-center"
                        >
                            <div className="inline-block px-6 py-2 bg-white rounded-full shadow-lg">
                                <span className="text-2xl font-bold text-gray-800">
                                    {userRank.name}
                                </span>
                            </div>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="mt-8">
                            <div className="flex justify-between text-sm font-semibold text-white">
                                <span>Level {userRank.min}</span>
                                <span>Level {userRank.max}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-purple-600 rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="max-w-2xl mx-auto mt-8 text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Keep Learning and Level Up! 🚀
                        </h2>
                        <p className="text-white">
                            You're doing great! Complete more lessons and tests to reach the next rank.
                        </p>
                    </motion.div>
                </div>}
        </Tool>
    );
}