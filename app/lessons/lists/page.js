"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLessons } from "@/app/admin/lessons/libs/fetcher";
import { fetchLessonActivities } from "../libs/fetcher";
import Loading from "../../loading/page";
import Error from "../../admin/error/page";
import Link from "next/link";
import Tool from "@/app/components/Tool";

export default function LessonsList() {
    const [lessons, setLessons] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const [error, setError] = useState("");
    const [expandedLessonId, setExpandedLessonId] = useState(null);

    // Fetch lessons on component mount
    useEffect(() => {
        const fetchAllLessons = async () => {
            try {
                setLoading(true);
                const data = await fetchLessons();
                setLessons(data.lessons);
            } catch (error) {
                setError("Error fetching lessons: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllLessons();
    }, []);

    // Toggle expanded lesson
    const toggleLesson = async (lessonId) => {
        setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
        try {
            setActivityLoading(true);
            const data = await fetchLessonActivities(lessonId);
            setActivities(data.lessonActivities);
        } catch (error) {
            setError("Error fetching lesson activities: " + error);
        } finally {
            setActivityLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <Tool>
            <div className="min-h-screen  p-8">
                <h1 className="text-4xl font-bold text-violet-300 text-center mb-8">
                    Explore Lessons 🚀
                </h1>
                <div className="max-w-4xl mx-auto space-y-6">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20">
                            {/* Lesson Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-violet-500/10 transition"
                                onClick={() => toggleLesson(lesson.id)}
                            >
                                <h2 className="text-2xl font-semibold text-violet-200">
                                    {lesson.title}
                                </h2>
                                <p className="text-violet-100 mt-2">{lesson.description}</p>
                            </div>

                            {/* Activities Section */}
                            <AnimatePresence>
                                {expandedLessonId === lesson.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-6"
                                    >
                                        {activityLoading ? (
                                            <Loading />
                                        ) : (
                                            <div className="mt-4 space-y-4">
                                                {activities.map((activity) => (
                                                    <div
                                                        key={activity.id}
                                                        className="p-4 bg-violet-500/10 backdrop-blur-md rounded-lg shadow-sm hover:shadow-md transition-shadow border border-white/20"
                                                    >
                                                        <h3 className="text-xl font-semibold text-violet-200">
                                                            {activity.title}
                                                        </h3>
                                                        <p className="text-violet-100 mt-2">
                                                            {activity.description}
                                                        </p>
                                                        {activity.image && (
                                                            <img
                                                                src={`/uploads/activities/${activity.image}`}
                                                                alt={activity.title}
                                                                className="w-full h-40 object-cover rounded-lg my-4"
                                                            />
                                                        )}
                                                        <Link
                                                            href={`/lessons/${activity.id}`}
                                                            className="my-5 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                                                        >
                                                            Start Activity
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </Tool>
    );
}