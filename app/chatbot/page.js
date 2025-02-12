"use client"
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function ChatBot() {
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you learn today? 😊", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            console.log("response is", data.reply);
            
            setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Oops! Something went wrong. Try again!", sender: "bot" }]);
        }
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="lg:max-w-2xl max-w-md mt-24 mx-auto bg-violet-50 p-4 rounded-lg shadow-lg border-2 border-violet-200">
            <div className="bg-violet-600 text-white text-center py-3 rounded-t-lg font-bold text-lg flex justify-center items-center">
                🤖 AI Learning Buddy
            </div>
            <div className="h-[500px] overflow-y-auto p-3 bg-white rounded-md shadow-inner">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`px-4 py-2 rounded-lg lg:max-w-xl max-w-xs ${msg.sender === "user" ? "bg-violet-400 text-white" : "bg-violet-200 text-black"}`}>
                            <ReactMarkdown
                                components={{
                                    code: ({ node, ...props }) => (
                                        <code className="bg-violet-100 text-violet-800 p-1 rounded" {...props} />
                                    ),
                                    pre: ({ node, ...props }) => (
                                        <pre className="bg-violet-100 text-violet-800 p-2 rounded-md overflow-x-auto" {...props} />
                                    )
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <p className="text-gray-500">Thinking... 🤔</p>}
            </div>
            <div className="flex items-center mt-2 border-t pt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 rounded-l-lg border border-violet-300 focus:outline-none focus:border-violet-500"
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-violet-600 text-white px-4 py-2 rounded-r-lg flex items-center hover:bg-violet-700 transition"
                >
                    <PaperAirplaneIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}