"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLessons } from "@/app/admin/lessons/libs/fetcher";
import { fetchLessonActivities } from "../libs/fetcher";
import Loading from "../../loading/page";
import Error from "../../admin/error/page";
import Link from "next/link";
import Tool from "@/app/components/Tool";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { fetchSkills } from "@/app/admin/skills/libs/fetcher";

export default function LessonsList() {
    const [lessons, setLessons] = useState([]);
    const [skills, setSkills] = useState([])
    const [filterSkill, setFilterSkill] = useState('')
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const [error, setError] = useState("");
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")

    const filterLessons = lessons && lessons.filter(lesson => (lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || lesson.description.toLowerCase().includes(searchTerm.toLocaleLowerCase()) )&& (filterSkill ? lesson.skill.title === filterSkill : true));

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
        const fetchAllSkills = async () => {
            try {
                setLoading(true);
                const data = await fetchSkills();
                setSkills(data.skills);
            } catch (error) {
                setError("Error fetching skills: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllLessons();
        fetchAllSkills();
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
            <div className="min-h-screen px-8 py-5">
                <div className="relative">
                    {/* Back Button */}
                    <Link
                        href={"/"}
                        className="flex items-center absolute left-0 top-0 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h1 className="md:text-4xl text-2xl font-bold text-violet-300 text-center mb-8">Explore Lessons 🚀</h1>
                </div>

                {/* Search & Filter Section */}
                <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-2/3 p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />

                    {/* Filter Dropdown */}
                    <select
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                        className="w-full sm:w-1/3 p-3 rounded-lg bg-purple-500 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                        <option value="">All Skills</option>
                       
                        {
                            skills.map((skill, index) => {
                                return (<option key={index} value={skill.title}>{skill.title}</option>)
                            })
                        }
                    </select>
                </div>

                {/* Lesson Cards */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {filterLessons.length > 0 ? (
                        filterLessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20"
                            >
                                {/* Lesson Header */}
                                <div
                                    className="p-6 cursor-pointer hover:bg-violet-500/10 transition"
                                    onClick={() => toggleLesson(lesson.id)}
                                >
                                    <h2 className="text-2xl font-semibold text-violet-200">{lesson.title}</h2>
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
                                                            <h3 className="text-xl font-semibold text-violet-200">{activity.title}</h3>
                                                            <p className="text-violet-100 mt-2">{activity.description}</p>
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
                        ))
                    ) : (
                        <p className="text-center text-violet-200">No lessons found.</p>
                    )}
                </div>
            </div>
        </Tool>
    );
}