const API_BASE_URL = "/api/skills"; // Base URL for your API routes

export const fetchSkills = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch skills");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching skills:", error.message || error);
        throw error;
    }
};

export const fetchSkill = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch skill");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching skill:", error.message || error);
        throw error;
    }
};



export const createSkill = async (title, description) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description }),
        });
        if (!response.ok) {
            throw new Error("Failed to create skill");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating skill:", error.message || error);
        throw error;
    }
};


export const updateSkill = async (id, title, description) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title,description }),
        });
        if (!response.ok) {
            throw new Error("Failed to update skill");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating skill:", error.message || error);
        throw error;
    }
};

export const deleteSkill = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete skill");
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting skill:", error.message || error);
        throw error;
    }
};