'use client'

import { useEffect, useState } from "react";
import Loading from "@/app/loading/page";
import Error from "@/app/admin/error/page";
import { fetchScores } from "../libs/fetcher";
import { useSession } from "next-auth/react";
import Tool from "@/app/components/Tool";

const levelNames = [
    { min: 0, max: 30, name: "🌱 Little Explorer", color: "bg-red-400" },
    { min: 31, max: 50, name: "🏆 Junior Learner", color: "bg-orange-400" },
    { min: 51, max: 70, name: "🚀 Smart Thinker", color: "bg-yellow-400" },
    { min: 71, max: 90, name: "🌟 Brainy Champ", color: "bg-green-400" },
    { min: 91, max: 100, name: "👑 Master Genius", color: "bg-blue-400" }
];

export default function RankingBoard() {

    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchAllScores = async () => {
            try {
                setLoading(true)
                const data = await fetchScores();
                setRankings(data.scores);
            } catch (error) {
                setError("Error fetching scores:", error.message || error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllScores();
    }, []);

    const getLevel = (score) => {
        return levelNames.find(level => score >= level.min && score <= level.max);
    };

    const userScores = rankings.reduce((acc, curr) => {
        if (!acc[curr.userId]) {
            acc[curr.userId] = { userId: curr.userId, userName: curr.user.name, testId: curr.testId, testTitle: curr.test.title, totalScore: 0 };
        }
        acc[curr.userId].totalScore += curr.score;
        return acc;
    }, {});



    let authUserScore;
    let authUserLevel;
    if (session?.user && userScores) {
        const authId = session?.user?.id;
        authUserScore = Object.values(userScores).find(userScore => userScore.userId === authId)
        authUserLevel =authUserScore && getLevel(authUserScore.totalScore)

    }



    // Step 2: Convert object to sorted array
    const sortedRanking = Object.values(userScores).sort((a, b) => b.totalScore - a.totalScore);




    if (status === "loading") {
        return <Loading />;
    }


    if (loading) {
        return (<Loading />)
    }

    if (error) {
        return (<Error error={error} />)
    }

    return (
        <Tool>
        <div className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-black font-bold text-center mb-4">🏆 Kids Test Rankings</h2>
            <div className="overflow-x-auto">
                {authUserScore &&

                    <div className="my-3 text-black">Your rank : {authUserScore.totalScore} {authUserLevel.name}</div>
                }
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-2 border">Rank 📊</th>
                            <th className="p-2 border">User  🆔</th>
                            <th className="p-2 border">Test  📝</th>
                            <th className="p-2 border">Score 🏅</th>
                            <th className="p-2 border">Level 🌟</th>
                            <th className="p-2 border">Progress 📈</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedRanking.map((kid, index) => {
                                const level = getLevel(kid.totalScore);
                                return (
                                    <tr key={`${kid.userId}-${kid.testId}`} className="text-center text-black border-b">
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{kid.userName}</td>
                                        <td className="p-2 border">
                                            {kid.testTitle ? (kid.testTitle.length > 10 ? `${kid.testTitle.slice(0, 10)}...` : kid.testTitle) : "No Title"}
                                        </td>

                                        <td className="p-2 border font-bold">{kid.totalScore}</td>
                                        <td className="p-2 border">{level.name}</td>
                                        <td className="p-2 border">
                                            <div className="w-full bg-gray-200 rounded-full">
                                                <div
                                                    className={`h-4 rounded-full ${level.color}`}
                                                    style={{ width: `${kid.totalScore}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
        </Tool>
    );
}
