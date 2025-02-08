"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchActivity } from "../../admin/activities/libs/fetcher";
import { fetchLessonActivities } from "../libs/fetcher";
import Loading from "../../loading/page";
import Error from "../../admin/error/page";
import Link from "next/link";

export default function LearningActivity({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [activities, setActivities] = useState([])
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false)
    const [error, setError] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        async function fetchOneActivity() {
            try {
                setLoading(true);
                const data = await fetchActivity(id);
                setActivity(data.activity);
            } catch (error) {
                setError("Error fetching activity: " + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOneActivity();
    }, [id]);

    useEffect(() => {
        if (!activity.lessonId) return; // Ensure activity.id exists before fetching

        async function fetchAllLessonActivities() {
            try {
                setActivityLoading(true);
                const data = await fetchLessonActivities(activity.lessonId);
                setActivities(data.lessonActivities);
            } catch (error) {
                setError("Error fetching lesson activities: " + error.message);
            } finally {
                setActivityLoading(false);
            }
        }

        fetchAllLessonActivities();
    }, [activity.id]);

    console.log(activities);



    // Text-to-Speech with Word Highlighting
    const handleSpeak = () => {
        if (!activity.content) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
            return;
        }

        const words = activity.content.split(" ");
        let index = 0;

        const speech = new SpeechSynthesisUtterance(activity.content);
        speech.lang = "en-US";
        speech.rate = 0.85;
        speech.pitch = 1.2;

        speech.onboundary = (event) => {
            if (event.name === "word") {
                setCurrentWordIndex(index++);
            }
        };

        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => {
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
        };

        window.speechSynthesis.speak(speech);
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!activity) return <p className="text-center text-gray-500 mt-10">Activity not found.</p>;

    return (
        <div className="flex flex-col mt-16 items-center min-h-screen bg-gradient-to-r from-yellow-100 to-pink-200 p-6 font-serif">


            {/* Storybook Card */}
            <motion.div
                className="max-w-2xl w-full shadow-2xl rounded-xl bg-white border-4 border-yellow-500 p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
<div className="flex items-center justify-around">
                <Link href="/">
                    <button
                        className="px-4 py-2  bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        ⬅ Back
                    </button>
                </Link>
                {/* Story Title */}
                <h2 className="text-4xl font-semibold text-purple-800 animate-pulse">{activity.title}</h2>
                </div>
                {/* Lesson & Skill Type */}
                <div className="mt-4 text-lg text-gray-700">
                    <span className="font-semibold">Lesson:</span> {activity.lesson?.title}
                </div>
                <div className="text-lg text-gray-700">
                    <span className="font-semibold">Skill:</span> {activity.lesson?.skill?.title || "Unknown"}
                </div>
                {activity.image && (
                    <img
                        src={`/uploads/activities/${activity.image}`}
                        alt={activity.title}
                        className="w-full h-60  mt-2 object-cover rounded-lg mb-6 shadow-xl border-4 border-pink-400"
                    />
                )}
                {/* Storytelling Section */}
                <div className="mt-6 text-xl text-gray-900 bg-yellow-200 p-6 rounded-lg leading-relaxed italic shadow-md">
                    <p>
                        {activity.content}
                        {/* {activity.content?.split(" ").map((word, index) => (
                            <span 
                                key={index} 
                                className={`mx-1 px-2 py-1 transition-all duration-300 rounded-md ${index === currentWordIndex ? "bg-red-500 text-white scale-110 shadow-lg" : "bg-white"}`}
                            >
                                {word}
                            </span>
                        ))} */}
                    </p>
                    <button
                        onClick={handleSpeak}
                        className={`mt-4 px-8 py-3 text-white text-lg rounded-full shadow-md transition-all ${isSpeaking ? "bg-red-500 hover:bg-red-400" : "bg-green-600 hover:bg-green-500"}`}
                    >
                        {isSpeaking ? "🎤 Stop Narration" : "📢 Start Story"}
                    </button>
                </div>

                {/* Created Date */}
                <div className="my-6 text-sm text-gray-500">
                    Created: {new Date(activity.createdAt).toLocaleDateString()}
                </div>

                <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
                    <motion.h1
                        className="text-4xl font-bold text-purple-800 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activities?.[0]?.lesson?.title || "No title available"}


                    </motion.h1>
                    <motion.h1
                        className="text-4xl font-bold text-purple-800 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        📚 Lesson List - {activities.length}
                    </motion.h1>

                    <div className="w-full">
                        {activities.map((activityLesson, index) => (
                            activityLoading ? (<Loading />) :
                                (<motion.div
                                    key={activityLesson.id}
                                    className={`p-6 rounded-xl mt-1 shadow-lg border-l-4 border-t-4 border-purple-500 ${activityLesson.id == activity.id ? 'bg-purple-500' : ''} cursor-pointer hover:shadow-xl hover:bg-purple-50 transition-all`}
                                    onClick={() => router.push(`/lessons/${activityLesson.id}`)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >

                                    <h2 className="text-2xl mt-2 font-semibold text-gray-900">{activityLesson.title}</h2>
                                </motion.div>)
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
