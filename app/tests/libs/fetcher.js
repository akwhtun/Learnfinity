const API_BASE_URL = "/api/testQuizes"; 

export const fetchTestQuizes = async (id) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch testQuizes");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching testQuizes:", error.message || error);
        throw error;
    }
};
