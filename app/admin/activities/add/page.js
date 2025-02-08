"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Error from "../../error/page";
import Alert from "@/app/components/Alter";
import { fetchLessons } from "../../lessons/libs/fetcher";
import { createActivity } from "../libs/fetcher";

export default function AddActivity() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("")
    const [image, setImage] = useState("")
    const [selectedLesson, setSelectedLesson] = useState("");
    const [lessons, setLessons] = useState([])
    const [error, setError] = useState("")
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
        const fetchAllLessons = async () => {
            try {
                const data = await fetchLessons();
                setLessons(data.lessons);
            } catch (error) {
                setError("Error fetching lessons:", error.message || error);
            }
        };
        fetchAllLessons();
    }, []);

    const handleSubmit = async (e) => {

        try {
            e.preventDefault()
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("content", content);
            formData.append("lessonId", selectedLesson);
            if (image) {
                formData.append("image", image);
            }
            setLoading(true)
            const newActivity = await createActivity(formData);
            setAlertMessage(newActivity.message);
            handleShowAlert("success", newActivity.message)
        } catch (error) {
            handleShowAlert("error", "Error creating activity:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<Loading />)
    }

    if(error){
        return(<Error error={error}/>)
    }

    return (
        <div className="mt-24">
            <Link
                href="/admin/activities"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back to Activity
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Activity</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Activity Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter activity title"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter activity description"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                   


                    <div>
                        <label className="block text-gray-700 font-medium">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter activity content"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Image (URL)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                    <div>
                        <label htmlFor="lessonSelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Lesson
                        </label>

                        <select
                            id="lessonSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={selectedLesson} // Controlled component state
                            onChange={(e) => setSelectedLesson(e.target.value)} // Handle change
                            required
                        >
                            <option value="">Select a lesson</option>
                            {lessons.map((lesson) => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform ">
                        🚀 Add Activity
                    </button>
                </form>
            </div>
        </div>
    );
}
