"use client"
import { useState } from "react";
import LessonForm from "./lessonForm";
import LessonList from "./lessonList";

export default function Home() {
    const [editLesson, setEditLesson] = useState(null);

    // Handle editing a lesson
    const handleEdit = (lesson) => {
        setEditLesson(lesson);
    };

    return (
        <div>
           <LessonForm/>
        </div>
    );
}