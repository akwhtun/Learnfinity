"use client"
import { useEffect, useState } from "react";
import { getLessons, deleteLesson } from "./libs/fetcher";

const LessonList = ({ onEdit }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch lessons on component mount
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const data = await getLessons();
                setLessons(data.lessons);
            } catch (error) {
                console.error("Error fetching lessons:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    // Handle lesson deletion
    const handleDelete = async (id) => {
        try {
            await deleteLesson(id);
            setLessons(lessons.filter((lesson) => lesson.id !== id));
        } catch (error) {
            console.error("Error deleting lesson:", error.message || error);
        }
    };

    if (loading) {
        return <p>Loading lessons...</p>;
    }

    return (
        <div>
            <h2>Lessons</h2>
            {lessons.length === 0 ? (
                <p>No lessons found.</p>
            ) : (
                <ul>
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            {lesson.lesson}
                            <button onClick={() => onEdit(lesson)}>Edit</button>
                            <button onClick={() => handleDelete(lesson.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LessonList;