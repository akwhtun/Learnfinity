"use client"
import Link from "next/link";
import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import { fetchSkills, deleteSkill } from "./libs/fetcher";
import Alert from "@/app/components/Alter";

export default function AdminSkills() {

    const [skills, setSkills] = useState([])
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

        const handleSkillDelete = async (id) => {
            try {
                const data = await deleteSkill(id);
                setSkills(skills.filter((skill) => skill.id !== id));
                handleShowAlert("success", data.message)
            } catch (error) {
                handleShowAlert("error","Error deleting skill:", error.message || error);
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
      <Sidebar/>
      <div className="flex-1 p-8">
         {showAlert && (
                <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
              )}
        <div className="flex items-center justify-between mb-2">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Skills Management</h2>
      <Link href="/admin/skills/add" className="w-40 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-lg font-semibold transition-transform transform ">
        Add New Skill
      </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300  hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700">{skill.title}</h3>
            <p className="text-gray-600 mt-2">{skill.description}</p>
            <Link href={`/admin/skills/edit/${skill.id}`} className="inline-block mt-4 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition">
              Edit
            </Link>
            <button onClick={()=>handleSkillDelete(skill.id)} className="mx-4 inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
