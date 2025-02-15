const API_BASE_URL = "/api/scores"; 

export const fetchUserScores = async (id) => {

    console.log("user id", id);
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user scores");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user scores:", error.message || error);
        throw error;
    }
};