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

// Create a new lesson
export const createLesson = async (lesson) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ lesson }),
        });
        if (!response.ok) {
            throw new Error("Failed to create lesson");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating lesson:", error.message || error);
        throw error;
    }
};

// Update an existing lesson
export const updateLesson = async (id, lesson) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, lesson }),
        });
        if (!response.ok) {
            throw new Error("Failed to update lesson");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating lesson:", error.message || error);
        throw error;
    }
};

// Delete a lesson
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
        console.error("Error deleting lesson:", error.message || error);
        throw error;
    }
};