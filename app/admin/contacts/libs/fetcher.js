const API_BASE_URL = "/api/contacts"; 

export const fetchContacts = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch contacts");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching contacts:", error.message || error);
        throw error;
    }
};

export const fetchOneContact  = async (id) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch one contact");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching one contact:", error.message || error);
        throw error;
    }
};

export const createContact = async (name,email,content) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,email,content }),
        });
        if (!response.ok) {
            throw new Error("Failed to create content");
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating content:", error.message || error);
        throw error;
    }
};

export const updateContact = async (id, isRead) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead }),
        });
        if (!response.ok) {
            throw new Error("Failed to update contact");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating contact:", error.message || error);
        throw error;
    }
};

