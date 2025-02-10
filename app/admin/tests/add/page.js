"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Error from "../../error/page";
import Alert from "@/app/components/Alter";
import { createTest } from "../libs/fetcher";
import { levels } from "../../component/Levels";
import { categories } from "../../component/Categories";

export default function AddTest() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevle] = useState("")
    const [category, setCategory] = useState("")
    const [image, setImage] = useState("")
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

    const handleSubmit = async (e) => {

        try {
            e.preventDefault()
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("level", level);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }
            setLoading(true)
            const newTest = await createTest(formData);
            setAlertMessage(newTest.message);
            handleShowAlert("success", newTest.message)
        } catch (error) {
            handleShowAlert("error", "Error creating test:", error.message || error);
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
                href="/admin/tests"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back to Test
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Test</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Test Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter test title"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter test description"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="levelSelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Level
                        </label>

                        <select
                            id="levelSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={level} // Controlled component state
                            onChange={(e) => setLevle(e.target.value)} // Handle change
                            required
                        >
                            <option value="">Select a level</option>
                            {levels.map((level,index) => (
                                <option key={index} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="categorySelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Category
                        </label>

                        <select
                            id="categorySelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={category} // Controlled component state
                            onChange={(e) => setCategory(e.target.value)} // Handle change
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category,index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
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


                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform ">
                        🚀 Add test
                    </button>
                </form>
            </div>
        </div>
    );
}
