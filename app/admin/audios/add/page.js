"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Error from "../../error/page";
import Alert from "@/app/components/Alter";
import { fetchLessons } from "../../lessons/libs/fetcher";
import { createAudio } from "../libs/fetcher";

export default function AddActivity() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [audio, setAudio] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState("");
    const [lessons, setLessons] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
                setError(`Error fetching lessons: ${error.message || error}`);
            }
        };
        fetchAllLessons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("lessonId", selectedLesson);
            formData.append("audio", audio);
            formData.append("image", image);


            setLoading(true);
            const newAudio = await createAudio(formData);
            handleShowAlert("success", newAudio.message);

            // Reset form after successful upload
            setTitle("");
            setDescription("");
            setAudio(null);
            setImage(null)
            setSelectedLesson("");
        } catch (error) {
            handleShowAlert("error", `Error creating audio: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error error={error} />;
    }

    return (
        <div className="mt-24">
            <Link
                href="/admin/audios"
                className="px-4 py-2 w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back to Audio
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Audio</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Audio Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter audio title"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter audio description"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Upload Audio</label>
                        <input
                            type="file"
                            accept="audio/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setAudio(e.target.files[0])}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lessonSelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Lesson
                        </label>
                        <select
                            id="lessonSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
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
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform"
                    >
                        🚀 Add Audio
                    </button>
                </form>
            </div>
        </div>
    );
}
