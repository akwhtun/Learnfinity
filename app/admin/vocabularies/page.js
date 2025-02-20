"use client"
import Link from "next/link";
import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import { fetchVocabularies,deleteVocabulary } from "./libs/fetcher";
import Alert from "@/app/components/Alter";

export default function AdminSkills() {

    const [vocabularies, setVocabularies] = useState([])
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
            const fetchAllVocabulary = async () => {
                try {
                    setLoading(true)
                    const data = await fetchVocabularies();
                    setVocabularies(data.vocabularies);
                } catch (error) {
                    setError(`Error fetching vocabulary:, ${error.message || error}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllVocabulary();
        }, []);

        const handleVocabularyDelete = async (id) => {
            try {
                const data = await deleteVocabulary(id);
                setVocabularies(vocabularies.filter((vocablary) => vocablary.id !== id));
                handleShowAlert("success", data.message)
            } catch (error) {
                handleShowAlert("error","Error deleting vocabulary:", error.message || error);
            }
        }

        if(error){
            return (<Error error={error}/>)
        }

        if(loading){
            return (<Loading/>)
        }
  return (
    <div className="flex  min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
    <Sidebar />
    <div className="flex-1 p-8">
      {showAlert && (
        <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Vocablary Management</h2>
        <Link href="/admin/vocabularies/add" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-lg">
          Add New Vocabulary
        </Link>
      </div>
  {vocabularies.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
            <tr>
              <th className="p-4">English Word</th>
              <th className="p-4">Myanmar Meaning</th>
              <th className="p-4">Emoji</th>
              <th className="p-4">Speech</th>
              <th className="p-4">Activity Title</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {vocabularies.map((vocablary, index) => (
              <tr key={vocablary.id} className="border-b transition hover:bg-gray-100">
                <td className="p-4 font-semibold text-gray-800">{vocablary.englishWord}</td>
                <td className="p-4 text-gray-600">{vocablary.myanmarMeaning}</td>
                <td className="p-4 text-gray-600">{vocablary.emoji}</td>
                <td className="p-4 text-gray-700">{vocablary.speech}</td>
                <td className="p-4 text-gray-700">{vocablary.activity.title}</td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <Link href={`/admin/vocabularies/edit/${vocablary.id}`} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
                    Edit
                  </Link>
                  <button onClick={() => handleVocabularyDelete(vocablary.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>) : (<div className="text-xl text-center mt-9">
        No vocabulary found...
      </div>)}
      
    </div>
  </div>
  
  );
}
