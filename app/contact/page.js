"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { createContact } from "../admin/contacts/libs/fetcher";
import Loading from "../admin/loading/page";
import Error from "../admin/error/page";
import Tool from "../components/Tool";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function ContactPage() {

    const { data: session } = useSession();
    const [content, setContent] = useState("")
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    let name, email;

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            setMessage("Please fill in all fields! 🚨");
            return;
        }
        try {
            e.preventDefault()
            setLoading(true)
            name = session?.user?.name;
            email = session?.user?.email;
            const newContact = await createContact(name, email, content);
            if (newContact) {
                setMessage("Message sent successfully! ✅");
                setContent("")
            }
        } catch (error) {
            setError(error.message || error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (<Loading />)
    }

    if (error) {
        return (<Error error={error} />)
    }

    return (
        <Tool>
        <div className="min-h-screen bg-transparent relative flex justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className=" p-8 rounded-xl shadow-lg max-w-xl w-full"
            >
                     <Link
                    href={"/"}
                    className="flex items-center absolute left-2 top-2 gap-2 p-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                 {/* Message Alert */}
                 {message && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center font-semibold text-lg text-white"
                    >
                        {message}
                    </motion.div>
                )}
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    📬 Contact Us
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {session?.user ? (
                        <>
                            {/* Name Input */}
                            <div>
                                <label className="block text-lg text-white">📛 Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={session?.user?.name}
                                    className="w-full text-black p-3 mt-1 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    readOnly
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-lg text-white">📧 Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={session?.user?.email}
                                    className="w-full text-black p-3 mt-1 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    readOnly
                                />
                            </div></>) : (<div></div>)}

                    {/* Message Input */}
                    <div>
                        <label className="block text-lg text-white">📝 Message:</label>
                        <textarea
                            name="content"
                            value={content}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-3 text-black mt-1 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Type your message..."
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-purple-700 transition"
                    >
                        🚀 Send Message
                    </motion.button>
                </form>

               
            </motion.div>
        </div>
        </Tool>
    );
}
