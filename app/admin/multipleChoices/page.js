"use client"
import Link from "next/link";
import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import Alert from "@/app/components/Alter";
import { fetchMultipleChoices, deleteMultipleChoice } from "./libs/fetcher";

export default function MultipleChoices() {

    const [multipleChoices, setMultipleChoices] = useState([])
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
        const fetchAllMultipleChoices = async () => {
            try {
                setLoading(true)
                const data = await fetchMultipleChoices();
                setMultipleChoices(data.multipleChoices);
            } catch (error) {
                setError("Error fetching multipleChoices:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllMultipleChoices();
    }, []);

    const handleMultipleChoiceDelete = async (id) => {
        try {
            const data = await deleteMultipleChoice(id);
            setMultipleChoices(multipleChoices.filter((multipleChoice) => multipleChoice.id !== id));
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error deleting multipleChoice:", error.message || error);
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
                    <h2 className="text-3xl font-bold text-gray-800">MultipleChoice Management</h2>
                    <Link href="/admin/multipleChoices/add" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
                        Add New MultipleChoice
                    </Link>
                </div>
                {multipleChoices.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
                            <tr>
                                <th className="p-4">Question</th>
                                <th className="p-4">Answer</th>
                                <th className="p-4">OtherWords</th>
                                <th className="p-4">Picture</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {multipleChoices.map((multipleChoice, index) => (
                                <tr key={multipleChoice.id} className="border-b transition hover:bg-gray-100">
                                    <td className="p-4 font-semibold text-gray-800">{multipleChoice.question.slice(0,15)}...</td>
                                    <td className="p-4 text-gray-600">{multipleChoice.answer}</td>
                                    <td className="p-4 text-gray-600">{multipleChoice.otherWords}</td>
                                    <td className="p-4 text-gray-600">
                                        {multipleChoice.image && (
                                            <img
                                                src={`/uploads/multipleChoices/${multipleChoice.image}`}
                                                alt={multipleChoice.answer}
                                                className="w-full h-10 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                    </td>
                                    <td className="p-4 text-center flex justify-center gap-3">
                                        <Link href={`/admin/multipleChoices/edit/${multipleChoice.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </Link>
                                        <Link href={`/admin/multipleChoices/view/${multipleChoice.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                                            View
                                        </Link>
                                        <button onClick={() => handleMultipleChoiceDelete(multipleChoice.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div className="text-xl text-center mt-9">
                    No multipleChoice found...
                </div>)}

            </div>
        </div>

    );
}
