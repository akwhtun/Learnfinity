"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOneContact } from "../../libs/fetcher";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";
import { updateContact } from "../../libs/fetcher";
import Alert from "@/app/components/Alter";

export default function ContactMessageView({ params }) {

    const { id } = React.use(params);
    const [contact, setContact] = useState({});
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
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
        async function fetchContact() {
            try {
                setLoading(true)
                const data = await fetchOneContact(id)
                setContact(data.contact);

            } catch (error) {
                setError('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchContact();
    }, []);


    const handleChange = async (id, isRead) => {
        const change = !isRead;
        try {
            const data = await updateContact(id, change);
            setContact(contact=> ({...contact,isRead:data.contact.isRead}))
            handleShowAlert("success", data.message)
        } catch (error) {
            handleShowAlert("error", "Error updating contact:", error.message || error);
        }
    }


    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                {showAlert && (
                    <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
                )}
                <h1 className="text-3xl font-bold text-blue-600 mb-4">📩 Contact Message</h1>

                {/* Back Button */}
                <Link href="/admin/contacts" className="text-blue-500 hover:underline mb-4 inline-block">
                    Back to Contact
                </Link>
                <button onClick={() => handleChange(contact.id, contact.isRead)} className={`px-4 py-2 mx-4 rounded-md text-white ${contact.isRead ? "bg-blue-500" : "bg-green-500"}`}>
                    {contact.isRead ? "Done" : "Mark as Read"}
                </button>

                {/* Message Details */}
                <div className="border-t border-gray-300 mt-4 pt-4">
                    <p className="text-lg font-semibold">🧑 Name: <span className="font-normal">{contact.name || "Ananymous Name"}</span></p>
                    <p className="text-lg font-semibold">📧 Email: <span className="font-normal">{contact.email || "Ananymous Email"}</span></p>
                    <p className="text-lg font-semibold">📅 Date: <span className="font-normal">{new Date(contact.createdAt).toLocaleString()}</span></p>
                    <p className="text-lg font-semibold mt-4">📝 Message:</p>
                    <p className="bg-gray-100 p-3 rounded-lg">{contact.content}</p>
                </div>


            </div>
        </div>
    );
}
