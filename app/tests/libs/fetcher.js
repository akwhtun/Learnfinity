
export const fetchTestQuizes = async (id) => {

    try {
        const response = await fetch(`/api/testQuizes/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch testQuizes");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching testQuizes:", error.message || error);
        throw error;
    }
};

export const fetchTestMultipleChoices = async (id) => {

    try {
        const response = await fetch(`/api/testMultipleChoices/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch testMultipleChoices");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching testMultipleChoices:", error.message || error);
        throw error;
    }
};

//save score
export const createProgress = async (userId, testId, score) => {
    const intUserId = parseInt(userId)
    const intTestId = parseInt(testId)
    const intScore = parseInt(score)
    
    try {
        const response = await fetch('/api/progresses', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:intUserId, testId:intTestId, score:intScore }),
        });
        if (!response.ok) {
            throw new Error("Failed to create progress");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating progress:", error.message || error);
        throw error;
    }
};


export const fetchScores = async () => {

    try {
        const response = await fetch(`/api/scores`);
        if (!response.ok) {
            throw new Error("Failed to fetch scores");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching scores:", error.message || error);
        throw error;
    }
};