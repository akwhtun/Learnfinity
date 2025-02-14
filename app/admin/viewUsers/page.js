"use client"

import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import Alert from "@/app/components/Alter";
import { updateUser, fetchUsers } from "./libs/fetcher";

export default function Users() {

    const [users, setUsers] = useState([])
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
        const fetchAllUsers = async () => {
            try {
                setLoading(true)
                const data = await fetchUsers();

                const admin = data.users.filter(user => user.isAdmin === true)
                const user = data.users.filter(user => user.isAdmin === false)
                setUsers([...admin, ...user])
            } catch (error) {
                setError("Error fetching users:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

    const handleChangeRole = async (id, isAdmin) => {
        const changeRole = !isAdmin;
        try {
            const data = await updateUser(id, changeRole);
            setUsers(users => users.map(user => user.id === id ? { ...user, isAdmin: data.user.isAdmin } : user))
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error updating user:", error.message || error);
        }
    }

    if (error) {
        return (<Error error={error} />)
    }

    if (loading) {
        return (<Loading />)
    }
    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
            <Sidebar />
            <div className="flex-1 p-8">
                {showAlert && (
                    <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
                )}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Users Management</h2>
                </div>
                {users.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Profile</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="border-b transition hover:bg-gray-100">
                                    <td className="p-4 font-semibold text-gray-800">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-gray-600">
                                        <img
                                            src={user.image}
                                            alt="User profile"
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                        />
                                    </td>
                                    <td className="p-4 text-gray-600">{user.isAdmin ? "Admin" : "User"}</td>

                                    <td className="p-4 text-center flex justify-center gap-3">
                                        <button onClick={() => handleChangeRole(user.id, user.isAdmin)} className={`px-4 py-2 rounded-md text-white ${user.isAdmin ? "bg-blue-500" : "bg-green-500"}`}>
                                            {user.isAdmin ? "Switch to User" : "Switch to Admin"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div className="text-xl text-center mt-9">
                    No user found...
                </div>)}

            </div>
        </div>

    );
}
