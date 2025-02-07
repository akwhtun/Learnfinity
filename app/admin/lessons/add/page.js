"use client"
import { useState,useEffect} from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Alert from "@/app/components/Alter";
import { createLesson } from "../libs/fetcher";
import { fetchSkills } from "../../skills/libs/fetcher";

export default function AddSkill() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skills, setSkills] = useState([])
    const [selectedSkill, setSelectedSkill] = useState("");
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

    useEffect(() => {
        const fetchAllSkills = async () => {
            try {
                setLoading(true)
                const data = await fetchSkills();
                setSkills(data.skills);
            } catch (error) {
                setError("Error fetching skills:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllSkills();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const newLesson = await createLesson(title, description, parseInt(selectedSkill));
            setAlertMessage(newLesson.message);
            handleShowAlert("success", newLesson.message)
        } catch (error) {
            handleShowAlert("error", "Error creating lesson:", error.message || error);
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
                href="/admin/lessons"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back to Lessons
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Lesson</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Lesson Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter lesson title"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter lesson description"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="skillSelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Skill
                        </label>

                        <select
                            id="skillSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={selectedSkill} // Controlled component state
                            onChange={(e) => setSelectedSkill(e.target.value)} // Handle change
                        >
                            <option value="">Select a Skill</option>
                            {skills.map((skill) => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform ">
                        🚀 Add Lesson
                    </button>
                </form>
            </div>
        </div>
    );
}
