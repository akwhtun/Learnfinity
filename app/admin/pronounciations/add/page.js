"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/loading/page";
import Error from "../../error/page";
import Alert from "@/app/components/Alter";
import { createText } from "../libs/fetcher";

export default function AddText() {

    const [text, setText] = useState("");
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
            formData.append("text", text);
            if (image) {
                formData.append("image", image);
            }
            setLoading(true)
            const newText = await createText(formData);
            setAlertMessage(newText.message);
            handleShowAlert("success", newText.message)
        } catch (error) {
            handleShowAlert("error", "Error creating Text:", error.message || error);
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
                href="/admin/pronounciations"
                className="px-4 py-2  w-64 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back To Pronounciation
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Pronounciation</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Pronounciation Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter pronounciation text"
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

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform ">
                        🚀 Add Pronounciation
                    </button>
                </form>
            </div>
        </div>
    );
}
