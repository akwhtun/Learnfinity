'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTests, deleteTest } from './libs/fetcher';
import Loading from '../loading/page';
import Error from '../error/page';
import Sidebar from '../component/Sidebar';
import Alert from '@/app/components/Alter';
import Link from 'next/link';

export default function TestList() {
    const [tests, setTests] = useState([]);
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
        async function fetchAllTests() {
            try {
                setLoading(true)
                const data = await fetchTests()
                setTests(data.tests);
            } catch (error) {
                setError('Error fetching tests:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllTests();
    }, []);

    const handleDeleteTest = async (id)=> {
        try {
            const data = await deleteTest(id);
            setTests(tests.filter((test) => test.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting test:", error.message || error);
        }
    }

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <div className="flex mt-16 min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />}

                <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Management</h1>

                {tests.length === 0 ? (
                    <p className="text-gray-500 text-center">No tests found.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        {tests.map((test) => {
                            const levelType = test.level || "Unknown level";

                            const levelStyle = {
                                "basic": "bg-blue-100 border-blue-400",
                                "intermediate": "bg-green-100 border-green-400",
                                "advance": "bg-orange-100 border-orange-400",
                            };

                            const cardStyle = levelStyle[levelType] || "bg-gray-100 border-gray-400";

                            return (
                                <motion.div
                                    key={test.id}
                                    className={`shadow-lg rounded-lg overflow-hidden p-4 border ${cardStyle} hover:shadow-2xl transition`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {test.image && (
                                        <img
                                            src={`/uploads/tests/${test.image}`}
                                            alt={test.title}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    )}

                                    <h2 className="text-xl font-semibold text-gray-800">{test.title}</h2>
                                    <p className="text-gray-600 mt-2">{test.description.slice(0, 40)}...</p>
                                

                                    <div className="mt-4 text-sm text-gray-700">
                                        <span className="font-semibold">Caetgory:</span> {test.category}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <span className="font-semibold">Level:</span> {levelType}
                                    </div>

                                    <div className='mt-2'>
                                        <Link href={`/admin/tests/edit/${test.id}`} className="px-5 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>
                                        <Link href={`/admin/tests/view/${test.id}`} className="px-5 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition">
                                            View
                                        </Link>
                                        <button onClick={() => handleDeleteTest(test.id)} className="px-4 py-2 mx-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
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
