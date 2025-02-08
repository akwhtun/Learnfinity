'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchActivities, deleteActivity } from './libs/fetcher';
import Loading from '../loading/page';
import Error from '../error/page';
import Sidebar from '../component/Sidebar';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function ActivityList() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const handleShowAlert = (type, message) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    useEffect(() => {
        async function fetchAllActivities() {
            try {
                setLoading(true)
                const data = await fetchActivities()
                setActivities(data.activities);
            } catch (error) {
                setError('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllActivities();
    }, []);

    const handleLessonActivity = async (id)=> {
        try {
            const data = await deleteActivity(id);
            setActivities(activities.filter((activity) => activity.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting activity:", error.message || error);
        }
    }

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex mt-16 min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />}

                <h1 className="text-3xl font-bold text-gray-800 mb-6">Activity Management</h1>

                {activities.length === 0 ? (
                    <p className="text-gray-500 text-center">No activities found.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {activities.map((activity) => {
                            const skillType = activity.lesson?.skill?.title || "Unknown Skill";

                            // Unique styles based on skill type
                            const skillStyles = {
                                "Listening": "bg-blue-100 border-blue-400",
                                "Reading": "bg-green-100 border-green-400",
                                "Writing": "bg-orange-100 border-orange-400",
                                "Speaking": "bg-purple-100 border-purple-400"
                            };

                            const cardStyle = skillStyles[skillType] || "bg-gray-100 border-gray-400";

                            return (
                                <motion.div
                                    key={activity.id}
                                    className={`shadow-lg rounded-lg overflow-hidden p-4 border ${cardStyle} hover:shadow-2xl transition`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {activity.image && (
                                        <img
                                            src={`/uploads/activities/${activity.image}`}
                                            alt={activity.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}

                                    <h2 className="text-xl font-semibold text-gray-800">{activity.title}</h2>
                                    <p className="text-gray-600 mt-2">{activity.description.slice(0, 40)}...</p>
                                    <p className="text-gray-600 mt-2">{activity.content.slice(0, 40)}...</p>

                                    <div className="mt-4 text-sm text-gray-700">
                                        <span className="font-semibold">Lesson:</span> {activity.lesson?.title}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <span className="font-semibold">Skill:</span> {skillType}
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">
                                        Created: {new Date(activity.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className='mt-2'>
                                        <Link href={`/admin/activities/edit/${activity.id}`} className="px-5 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>
                                        <Link href={`/admin/activities/view/${activity.id}`} className="px-5 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition">
                                            View
                                        </Link>
                                        <button onClick={() => handleLessonActivity(activity.id)} className="px-4 py-2 mx-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
