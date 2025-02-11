"use client"
import Link from "next/link";
import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import Alert from "@/app/components/Alter";
import { fetchQuizes, deleteQuiz } from "./libs/fetcher";

export default function Quizes() {

    const [quizes, setQuizes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
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
        const fetchAllQuizes = async () => {
            try {
                setLoading(true)
                const data = await fetchQuizes();
                setQuizes(data.quizes);
            } catch (error) {
                setError("Error fetching quizes:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllQuizes();
    }, []);

    const handleQuizDelete = async (id) => {
        try {
            const data = await deleteQuiz(id);
            setQuizes(quizes.filter((quiz) => quiz.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting quiz:", error.message || error);
        }
    }

    if (error) {
        return (<Error error={error} />)
    }

    if (loading) {
        return (<Loading />)
    }
    return (
        <div className="flex mt-16 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && (
                    <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
                )}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Quiz Management</h2>
                    <Link href="/admin/quizes/add" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
                        Add New Quiz
                    </Link>
                </div>
                {quizes.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
                            <tr>
                                <th className="p-4">Sentence</th>
                                <th className="p-4">Quiz</th>
                                <th className="p-4">Word Split</th>
                                <th className="p-4">Picture</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizes.map((quiz, index) => (
                                <tr key={quiz.id} className="border-b transition hover:bg-gray-100">
                                    <td className="p-4 font-semibold text-gray-800">{quiz.sentence.slice(0,15)}...</td>
                                    <td className="p-4 text-gray-600">{quiz.quizWord}</td>
                                    <td className="p-4 text-gray-600">{quiz.wordSplit == 1 ? "Yes" : "No"}</td>
                                    <td className="p-4 text-gray-600">
                                        {quiz.image && (
                                            <img
                                                src={`/uploads/quizes/${quiz.image}`}
                                                alt={quiz.quizWord}
                                                className="w-full h-10 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                    </td>
                                    <td className="p-4 text-center flex justify-center gap-3">
                                        <Link href={`/admin/quizes/view/${quiz.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
View
                                        </Link>
                                        <Link href={`/admin/quizes/edit/${quiz.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleQuizDelete(quiz.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div className="text-xl text-center mt-9">
                    No quiz found...
                </div>)}

            </div>
        </div>

    );
}
