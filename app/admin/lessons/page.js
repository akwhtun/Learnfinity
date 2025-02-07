"use client"
import Link from "next/link";
import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import { fetchLessons,deleteLesson } from "./libs/fetcher";
import Alert from "@/app/components/Alter";

export default function AdminSkills() {

    const [lessons, setLessons] = useState([])
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
            const fetchAllLessons = async () => {
                try {
                    setLoading(true)
                    const data = await fetchLessons();
                    setLessons(data.lessons);
                } catch (error) {
                    setError("Error fetching lessons:", error.message || error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllLessons();
        }, []);

        const handleLessonDelete = async (id) => {
            try {
                const data = await deleteLesson(id);
                setLessons(lessons.filter((lesson) => lesson.id !== id));
                handleShowAlert("success", data.message)
            } catch (error) {
                handleShowAlert("error","Error deleting lesson:", error.message || error);
            }
        }

        if(error){
            return (<Error error={error}/>)
        }

        if(loading){
            return (<Loading/>)
        }
  return (
    <div className="flex mt-16 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
    <Sidebar />
    <div className="flex-1 p-8">
      {showAlert && (
        <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Lesson Management</h2>
        <Link href="/admin/lessons/add" className="w-52 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center px-4 py-2 rounded-full shadow-lg flex items-center text-lg font-semibold transition-transform transform">
          Add New Lesson
        </Link>
      </div>
  {lessons.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Lesson Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Skill</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => (
              <tr key={lesson.id} className="border-b transition hover:bg-gray-100">
                <td className="p-4 text-gray-700">{index + 1}</td>
                <td className="p-4 font-semibold text-gray-800">{lesson.title}</td>
                <td className="p-4 text-gray-600">{lesson.description}</td>
                <td className="p-4 text-gray-600">{lesson.skill.title}</td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <Link href={`/admin/lessons/edit/${lesson.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                    Edit
                  </Link>
                  <button onClick={() => handleLessonDelete(lesson.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>) : (<div className="text-xl text-center mt-9">
        No lessons found...
      </div>)}
      
    </div>
  </div>
  
  );
}
