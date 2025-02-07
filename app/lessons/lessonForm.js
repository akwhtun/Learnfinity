"use client"
import { useState } from "react";
import { createLesson, updateLesson, deleteLesson } from "./libs/fetcher";

const LessonForm = () => {
    const [lesson, setLesson] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Update existing lesson
                const updatedLesson = await updateLesson(editId, lesson);
                setMessage(`Lesson updated: ${updatedLesson.lesson.lesson}`);
            } else {
                // Create new lesson
                const newLesson = await createLesson(lesson);
                setMessage(`Lesson created: ${newLesson.lesson.lesson}`);
            }
            setLesson("");
            setEditId(null);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    // Handle lesson deletion
    const handleDelete = async (id) => {
        try {
            await deleteLesson(id);
            setMessage("Lesson deleted successfully");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            {/* <h1>{editId ? "Edit Lesson" : "Create Lesson"}</h1> */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter lesson"
                    value={lesson}
                    onChange={(e) => setLesson(e.target.value)}
                    required
                />
                {/* <button type="submit">{editId ? "Update" : "Create"}</button> */}
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LessonForm;