
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
