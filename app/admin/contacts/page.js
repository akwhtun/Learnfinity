"use client"

import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import Loading from "../loading/page";
import Error from "../error/page";
import Alert from "@/app/components/Alter";
import Link from "next/link";
import { fetchContacts,updateContact } from "./libs/fetcher";

export default function Users() {

    const [contacts, setContacts] = useState([])
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
        const fetchAllContacts = async () => {
            try {
                setLoading(true)
                const data = await fetchContacts();

                const isRead = data.contacts.filter(contact => contact.isRead === true)
                const isNotRead = data.contacts.filter(contact => contact.isRead === false)
                setContacts([...isRead, ...isNotRead])
            } catch (error) {
                setError("Error fetching contacts:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllContacts();
    }, []);

    const handleChange = async (id, isRead) => {
        const change = !isRead;
        try {
            const data = await updateContact(id, change);
            setContacts(contacts => contacts.map(contact => contact.id === id ? { ...contact, isRead: data.contact.isRead } : contact))
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error updating contact:", error.message || error);
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
                    <h2 className="text-3xl font-bold text-gray-800">Contacts Management</h2>
                </div>
                {contacts.length > 0 ? (<div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-left">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Content</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={contact.id} className={`border-b transition hover:bg-gray-100  ${contact.isRead ? 'bg-gray-300' : 'bg-white'}`}>
                                    <td className="p-4 font-semibold text-gray-800">{contact.name || "Ananymous Name"}</td>
                                    <td className="p-4 text-gray-600">{contact.email || "Ananymous Email"}</td>
                                    <td className="p-4 text-gray-600">{contact.content.slice(0,40)}...</td>

                                    <td className="p-4 text-center flex justify-center gap-3">
                                        <Link href={`/admin/contacts/view/${contact.id}`}>
                                        <button className={`px-4 py-2 rounded-md text-white bg-purple-700`}>
                                        Check
                                        </button>
                                        </Link>
                                        <button onClick={() => handleChange(contact.id, contact.isRead)} className={`px-4 py-2 rounded-md text-white ${contact.isRead ? "bg-blue-500" : "bg-green-500"}`}>
                                            {contact.isRead ? "Done" : "Mark as Read"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div className="text-xl text-center mt-9">
                    No contact found...
                </div>)}

            </div>
        </div>

    );
}
