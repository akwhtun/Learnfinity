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
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-violet-900 to-purple-900 p-6 font-sans">
          {/* Storybook Card */}
          <motion.div
              className="max-w-2xl w-full shadow-2xl rounded-3xl bg-white/10 backdrop-blur-lg border-2 border-violet-500/30 p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
          >
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                  <Link href="/lessons/lists">
                      <button className="p-3 bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 transition-transform transform hover:scale-105">
                          <ArrowLeftIcon className="w-6 h-6" />
                      </button>
                  </Link>
                  <h2 className="text-3xl font-bold text-violet-100">{activity.title}</h2>
              </div>
  
              {/* Lesson & Skill Type */}
              <div className="mt-4 text-lg text-violet-200">
                  <span className="font-semibold">Lesson:</span> {activity.lesson?.title}
              </div>
              <div className="text-lg text-violet-200">
                  <span className="font-semibold">Skill:</span> {activity.lesson?.skill?.title || "Unknown"}
              </div>
  
              {/* Vocabulary Button */}
              <Link href={`/lessons/vocabularies/${activity.id}`}>
                  <button className="mt-6 px-6 py-3 text-lg font-semibold bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 transition-transform transform hover:scale-105">
                      📖 Learn Vocabulary First
                  </button>
              </Link>
  
              {/* Image Section */}
              {activity.image && (
                  <img
                      src={`/uploads/activities/${activity.image}`}
                      alt={activity.title}
                      className="w-full h-60 mt-6 object-cover rounded-2xl shadow-lg border-2 border-violet-500/30"
                  />
              )}
  
              {/* Storytelling Section */}
              <div className="mt-6 text-lg text-violet-100 bg-violet-500/20 backdrop-blur-lg p-6 rounded-xl leading-relaxed shadow-md">
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
              <div className="mt-6 text-sm text-violet-300">
                  Created: {new Date(activity.createdAt).toLocaleDateString()}
              </div>
  
              {/* Lesson List Section */}
              <div className="mt-8 w-full bg-violet-900/30 backdrop-blur-lg p-6 rounded-2xl shadow-inner">
                  <motion.h1
                      className="text-3xl font-bold text-violet-100 mb-6"
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
                                  className={`p-6 rounded-2xl shadow-lg border-l-2 border-t-2 border-violet-500/30 ${
                                      activityLesson.id === activity.id
                                          ? "bg-violet-600"
                                          : "bg-violet-500/20 backdrop-blur-lg"
                                  } cursor-pointer hover:shadow-xl hover:bg-violet-500/30 transition-all`}
                                  onClick={() => router.push(`/lessons/${activityLesson.id}`)}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                              >
                                  <h2 className="text-xl font-semibold text-violet-100">{activityLesson.title}</h2>
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
