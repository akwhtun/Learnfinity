const API_BASE_URL = "/api/lessonActivities"; 

export const fetchLessonActivities = async (id) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch lessonActivities");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching lessonActivities:", error.message || error);
        throw error;
    }
};


export const fetchLessonAudios = async (id) => {
    
    try {
        const response = await fetch(`/api/lessonAudios/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch lessonAudios");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching lessonAudios:", error.message || error);
        throw error;
    }
};

