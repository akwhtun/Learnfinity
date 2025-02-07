const API_BASE_URL = "/api/lessons"; // Base URL for your API routes

export const fetchLessons = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch lessons");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching lessons:", error.message || error);
        throw error;
    }
};

export const fetchLesson = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch lesson");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching lesson:", error.message || error);
        throw error;
    }
};



export const createLesson = async (title, description, skillId) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, skillId }),
        });
        if (!response.ok) {
            throw new Error("Failed to create lesson");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating lesson:", error.message || error);
        throw error;
    }
};


export const updateLesson = async (id, title, description, skillId) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title,description, skillId }),
        });
        if (!response.ok) {
            throw new Error("Failed to update lesson");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating lesson:", error.message || error);
        throw error;
    }
};

export const deleteLesson = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete lesson");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting lesson:", error.message || error);
        throw error;
    }
};