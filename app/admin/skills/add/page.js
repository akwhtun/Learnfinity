"use client"
import { useState } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Alert from "@/app/components/Alter";
import { createSkill } from "../libs/fetcher";
export default function AddSkill() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState("")
    const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); 
  };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const newSkill = await createSkill(title, description);
            setAlertMessage(newSkill.message);
            handleShowAlert("success", newSkill.message)
        } catch (error) {
            handleShowAlert("error", "Error creating skill:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="mt-24">
            <Link
                href="/admin/skills"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                ◀ Back to Skills
            </Link>

            {showAlert && (
        <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Skill</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Skill Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter skill title"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter skill description"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform">
                        🚀 Add Skill
                    </button>
                </form>
            </div>
        </div>
    );
}
