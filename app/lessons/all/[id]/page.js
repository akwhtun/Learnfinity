'use client'
import React, { useState, useEffect } from "react";
import { fetchLessonActivities } from "../../libs/fetcher";
import { fetchLessonAudios } from "../../libs/fetcher";
import Loading from "@/app/loading/page";
import Link from "next/link";
import Error from "@/app/admin/error/page";
import Tool from "@/app/components/Tool";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function ViewAllLessons({ params }) {

    const { id } = React.use(params)
    const [activities, setActivities] = useState([]);
    const [audios, setAudios] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAllLessonActivities() {
            try {
                setLoading(true);
                const data = await fetchLessonActivities(id);
                setActivities(data.lessonActivities);
            } catch (error) {
                setError("Error fetching lesson activities: " + error.message);
            } finally {
                setLoading(false);
            }
        }
        async function fetchAllLessonAudios() {
            try {
                setLoading(true);
                const data = await fetchLessonAudios(id);
                setAudios(data.lessonAudios);
            } catch (error) {
                setError("Error fetching lesson: " + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAllLessonActivities();
        fetchAllLessonAudios();
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <Tool>
    <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
            <Link
                href="/lessons/lists"
                className="flex items-center gap-2 p-3 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                <ArrowLeftIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Back to Lessons</span>
            </Link>
            {activities.length > 0 && (
                <h1 className="text-4xl font-bold text-gray-900">{activities[0]?.lesson?.title}</h1>
            )}
            {audios.length > 0 && (
                <h1 className="text-4xl font-bold text-gray-900">{audios[0]?.lesson?.title}</h1>
            )}
        </div>

        {/* Activities and Audios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Activities Section */}
            {activities.length > 0 && activities.map((activity) => (
                <div
                    key={activity.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                    {activity.image && (
                        <img
                            src={`/uploads/activities/${activity.image}`}
                            alt={activity.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{activity.title}</h2>
                        <p className="text-gray-600 mb-4">{activity.description.slice(0, 50)}...</p>
                        <p className="text-gray-600 mb-4">{activity.content.slice(0, 50)}...</p>
                        <Link href={`/lessons/${activity.id}`}>
                            <button className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-violet-600 transition-all duration-300">
                                View Details
                            </button>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Audios Section */}
            {audios.length > 0 && audios.map((audio) => (
                <div
                    key={audio.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                    {audio.image && (
                        <img
                            src={`/uploads/audioImages/${audio.image}`}
                            alt={audio.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{audio.title}</h2>
                        <p className="text-gray-600 mb-4">{audio.description.slice(0, 50)}...</p>
                        {audio.audio && (
                            <audio controls className="w-full mt-4">
                                <source src={`/uploads/audios/${audio.audio}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        <Link href={`/lessons/audios/${audio.id}`}>
                            <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-violet-600 transition-all duration-300">
                                Listen Now
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
</Tool>
    );
}
