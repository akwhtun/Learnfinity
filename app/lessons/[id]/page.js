"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchActivity } from "../../admin/activities/libs/fetcher";
import { fetchLessonActivities } from "../libs/fetcher";
import Loading from "../../loading/page";
import Error from "../../admin/error/page";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Tool from "@/app/components/Tool";

export default function LearningActivity({ params }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [activities, setActivities] = useState([])
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false)
    const [error, setError] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        async function fetchOneActivity() {
            try {
                setLoading(true);
                const data = await fetchActivity(id);
                setActivity(data.activity);
            } catch (error) {
                setError("Error fetching activity: " + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOneActivity();
    }, [id]);

    useEffect(() => {
        if (!activity.lessonId) return; 

        async function fetchAllLessonActivities() {
            try {
                setActivityLoading(true);
                const data = await fetchLessonActivities(activity.lessonId);
                setActivities(data.lessonActivities);
            } catch (error) {
                setError("Error fetching lesson activities: " + error.message);
            } finally {
                setActivityLoading(false);
            }
        }

        fetchAllLessonActivities();
    }, [activity.id]);

    console.log(activities);



    // Text-to-Speech with Word Highlighting
    const handleSpeak = () => {
        if (!activity.content) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
            return;
        }

        const words = activity.content.split(" ");
        let index = 0;

        const speech = new SpeechSynthesisUtterance(activity.content);
        speech.lang = "en-US";
        speech.rate = 0.85;
        speech.pitch = 1.2;

        speech.onboundary = (event) => {
            if (event.name === "word") {
                setCurrentWordIndex(index++);
            }
        };

        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => {
            setIsSpeaking(false);
            setCurrentWordIndex(-1);
        };

        window.speechSynthesis.speak(speech);
    };

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!activity) return <p className="text-center text-gray-500 mt-10">Activity not found.</p>;

    return (
        <Tool>
        <div className="flex flex-col items-center min-h-screen bg-gradient p-6 font-serif">
          {/* Storybook Card */}
          <motion.div
            className="max-w-2xl w-full shadow-2xl rounded-3xl bg-white/20 backdrop-blur-xl border-4 border-violet-500 p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <Link href="/lessons/lists">
                <button className="px-4 py-2 bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 transition">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              </Link>
              {/* Story Title */}
              <h2 className="text-4xl font-bold text-violet-200 animate-bounce">{activity.title}</h2>
            </div>
      
            {/* Lesson & Skill Type */}
            <div className="mt-4 text-lg text-violet-100">
              <span className="font-bold">Lesson:</span> {activity.lesson?.title}
            </div>
            <div className="text-lg text-violet-100">
              <span className="font-bold">Skill:</span> {activity.lesson?.skill?.title || "Unknown"}
            </div>
            <Link href={`/lessons/vocabularies/${activity.id}`}>
              <button className="mt-6 px-6 py-3 text-lg font-bold bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition">
                📖 Learn Vocabulary First
              </button>
            </Link>
            {/* Image Section */}
            {activity.image && (
              <img
                src={`/uploads/activities/${activity.image}`}
                alt={activity.title}
                className="w-full h-60 mt-4 object-cover rounded-2xl shadow-lg border-4 border-violet-500"
              />
            )}
      
            {/* Storytelling Section */}
            <div className="mt-6 text-xl text-violet-100 bg-violet-500/20 backdrop-blur-xl p-6 rounded-xl leading-relaxed italic shadow-md">
              <p>{activity.content}</p>
              <button
                onClick={handleSpeak}
                className={`mt-4 px-8 py-3 text-white text-lg rounded-full shadow-lg transition-all ${
                  isSpeaking ? "bg-red-500 hover:bg-red-400" : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                {isSpeaking ? "🎤 Stop Narration" : "📢 Start Story"}
              </button>
            </div>
      

      
            {/* Created Date */}
            <div className="my-6 text-sm text-violet-200">
              Created: {new Date(activity.createdAt).toLocaleDateString()}
            </div>
      
            {/* Lesson List Section */}
            <div className="flex flex-col items-center overflow-auto h-[400px] bg-gradient-to-br from-violet-900 via-purple-800 to-violet-900 p-8 rounded-2xl shadow-inner">
              <motion.h1
                className="text-4xl font-bold text-violet-200 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {activities?.[0]?.lesson?.title || "No title available"}
              </motion.h1>
              <motion.h1
                className="text-3xl font-bold text-violet-200 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                📚 Lesson List - {activities.length}
              </motion.h1>
      
              <div className="w-full space-y-4">
                {activities.map((activityLesson, index) =>
                  activityLoading ? (
                    <Loading />
                  ) : (
                    <motion.div
                      key={activityLesson.id}
                      className={`p-6 rounded-2xl shadow-lg border-l-4 border-t-4 border-violet-500 ${
                        activityLesson.id == activity.id ? "bg-violet-500" : "bg-violet-500/20 backdrop-blur-xl"
                      } cursor-pointer hover:shadow-xl hover:bg-violet-500/30 transition-all`}
                      onClick={() => router.push(`/lessons/${activityLesson.id}`)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h2 className="text-2xl font-semibold text-violet-100">{activityLesson.title}</h2>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Tool>
      
    
    );
}
