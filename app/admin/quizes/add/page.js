"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "../../loading/page";
import Error from "../../error/page";
import Alert from "@/app/components/Alter";
import { fetchTests } from "../../tests/libs/fetcher";
import { createQuiz } from "../libs/fetcher";

export default function AddQuiz() {
    const [tests, setTests] = useState([]);
    const [sentence, setSentence] = useState("");
    const [quizWord, setQuizWord] = useState("");
    const [wordSplit, setWordSplit] = useState()
    const [testId, setTestId] = useState("")
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

    useEffect(() => {
        const fetchAllTests = async () => {
            try {
                const data = await fetchTests();
                setTests(data.tests);
            } catch (error) {
                setError("Error fetching tests:", error.message || error);
            }
        };
        fetchAllTests();
    }, []);

    const handleSubmit = async (e) => {

        try {
            e.preventDefault()
            const formData = new FormData();
            formData.append("sentence", sentence);
            formData.append("quizWord", quizWord);
            formData.append("wordSplit", wordSplit);
            formData.append("testId", testId);
            if (image) {
                formData.append("image", image);
            }
            setLoading(true)
            const newQuiz = await createQuiz(formData);
            setAlertMessage(newQuiz.message);
            handleShowAlert("success", newQuiz.message)
        } catch (error) {
            handleShowAlert("error", "Error creating quiz:", error.message || error);
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
                href="/admin/quizes"
                className="px-4 py-2  w-40 mx-auto flex justify-center items-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition mb-4"
            >
                Back to quizes
            </Link>

            {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
            )}
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Quiz</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Quiz Sentence</label>
                        <textarea
                            value={sentence}
                            onChange={(e) => setSentence(e.target.value)}
                            placeholder="Enter quiz sentence"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">QuizWord</label>
                        <input
                            type="text"
                            value={quizWord}
                            onChange={(e) => setQuizWord(e.target.value)}
                            placeholder="Enter quiz word"
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
                        <label htmlFor="wordSplit" className="block text-lg font-medium text-gray-700 mb-2">
                            Define wordSplit or not
                        </label>
                        <select
                            id="wordSplit"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={wordSplit} // Controlled component state
                            onChange={(e) => setWordSplit(e.target.value)} // Handle change
                            required
                        >
                            <option value="">Define wordSplit or not</option>
                            <option value={1}>
                                    Split Word
                            </option>
                            <option value={2}>
                                    Not Split Word
                            </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="testSelect" className="block text-lg font-medium text-gray-700 mb-2">
                            Select Test
                        </label>

                        <select
                            id="testSelect"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={testId} 
                            onChange={(e) => setTestId(e.target.value)} 
                            required
                        >
                            <option value="">Select Test</option>
                            {tests.map((test) => (
                                <option key={test.id} value={test.id}>
                                    {test.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition transform ">
                        🚀 Add Quiz
                    </button>
                </form>
            </div>
        </div>
    );
}
