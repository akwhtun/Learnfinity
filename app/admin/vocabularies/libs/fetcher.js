const API_BASE_URL = "/api/vocabularies"; // Base URL for your API routes

export const fetchVocabularies = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch vocabularies");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching vocabularies:", error.message || error);
        throw error;
    }
};

export const fetchVocabulary = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch vocabulary");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching vocabulary:", error.message || error);
        throw error;
    }
};

export const fetchActivityVocabularies = async (id) => {
    try {
        const response = await fetch(`/api/activityVocabularies/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch activity vocabularies");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching activity vocabularies:", error.message || error);
        throw error;
    }
};

export const createVocabulary = async (englishWord,myanmarMeaning,emoji,speech, activityId) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ englishWord,myanmarMeaning,emoji, speech, activityId }),
        });
        if (!response.ok) {
            throw new Error("Failed to create activity");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating activity:", error.message || error);
        throw error;
    }
};


export const updateVocabulary = async (id, englishWord,myanmarMeaning,emoji, speech,activityId) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, englishWord,myanmarMeaning,emoji,speech,activityId }),
        });
        if (!response.ok) {
            throw new Error("Failed to update vocabulary");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating vocabulary:", error.message || error);
        throw error;
    }
};

export const deleteVocabulary = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete vocabulary");
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting vocabulary:", error.message || error);
        throw error;
    }
};