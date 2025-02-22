"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchAudio } from "@/app/admin/audios/libs/fetcher";
import { fetchLessonAudios } from "../../libs/fetcher";
import Loading from "@/app/admin/loading/page";
import Error from "@/app/admin/error/page";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Tool from "@/app/components/Tool";

export default function ListeningAudio({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [audios, setAudios] = useState([]);
    const [audio, setAudio] = useState({});
    const [loading, setLoading] = useState(false);
    const [audioLoading, setAudioLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchOneAudio() {
            try {
                setLoading(true);
                const data = await fetchAudio(id);
                setAudio(data.audio);
            } catch (error) {
                setError("Error fetching audio: " + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOneAudio();
    }, [id]);

    useEffect(() => {
        if (!audio.lessonId) return;

        async function fetchAllLessonAudios() {
            try {
                setAudioLoading(true);
                const data = await fetchLessonAudios(audio.lessonId);
                setAudios(data.lessonAudios);
            } catch (error) {
                setError("Error fetching lesson audios: " + error.message);
            } finally {
                setAudioLoading(false);
            }
        }

        fetchAllLessonAudios();
    }, [audio.lessonId]);

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!audio) return <p className="text-center text-gray-500 mt-10">Audio not found.</p>;

    return (
        <Tool>
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-violet-900 to-purple-800 p-6 font-serif">
                {/* Audio Card */}
                <motion.div
                    className="max-w-2xl w-full shadow-2xl rounded-3xl bg-white/20 backdrop-blur-xl border-4 border-violet-500 p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <Link href="/lessons/lists">
                            <button className="px-4 py-2 bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 transition">
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                        </Link>
                        {/* Audio Title */}
                        <h2 className="text-4xl font-bold text-violet-200">{audio.title}</h2>
                    </div>

                    {/* Lesson & Skill Type */}
                    <div className="mt-4 text-lg text-violet-100">
                        <span className="font-bold">Lesson:</span> {audio.lesson?.title}
                    </div>
                    <div className="text-lg text-violet-100">
                        <span className="font-bold">Skill:</span> {audio.lesson?.skill?.title || "Unknown"}
                    </div>

                    {/* Image Section */}
                    <img
                   src={`/uploads/audioImages/${audio.image}`}     
                        alt={audio.title}
                        className="w-full h-60 mt-4 object-cover rounded-2xl shadow-lg border-4 border-violet-500"
                    />

                    {/* Audio Player Section */}
                    <div className="mt-6">
                        <audio controls className="w-full mt-4">
                            <source src={`/uploads/audios/${audio.audio}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    {/* Description Section */}
                    <div className="mt-6 text-xl text-violet-100 bg-violet-500/20 backdrop-blur-xl p-6 rounded-xl leading-relaxed italic shadow-md">
                        <p>{audio.description}</p>
                    </div>

                    {/* Created Date */}
                    <div className="my-6 text-sm text-violet-200">
                        Created: {new Date(audio.createdAt).toLocaleDateString()}
                    </div>

                    {/* Lesson List Section */}
                    <div className="flex flex-col items-center overflow-auto h-[400px] bg-gradient-to-br from-violet-900 via-purple-800 to-violet-900 p-8 rounded-2xl shadow-inner">
                        <motion.h1
                            className="text-4xl font-bold text-violet-200 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {audios?.[0]?.lesson?.title || "No title available"}
                        </motion.h1>
                        <motion.h1
                            className="text-3xl font-bold text-violet-200 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            🎧 Audio List - {audios.length}
                        </motion.h1>

                        <div className="w-full space-y-4">
                            {audios.map((audioLesson, index) =>
                                audioLoading ? (
                                    <Loading />
                                ) : (
                                    <motion.div
                                        key={audioLesson.id}
                                        className={`p-6 rounded-2xl shadow-lg border-l-4 border-t-4 border-violet-500 ${
                                            audioLesson.id == audio.id ? "bg-violet-500" : "bg-violet-500/20 backdrop-blur-xl"
                                        } cursor-pointer hover:shadow-xl hover:bg-violet-500/30 transition-all`}
                                        onClick={() => router.push(`/lessons/audios/${audioLesson.id}`)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <h2 className="text-2xl font-semibold text-violet-100">{audioLesson.title}</h2>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </Tool>
    );
}