const API_BASE_URL = "/api/users"

export const fetchUsers = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error.message || error);
        throw error;
    }
};

export const updateUser = async (id, isAdmin) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({  id, isAdmin }),
        });
        if (!response.ok) {
            throw new Error("Failed to update user");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating user:", error.message || error);
        throw error;
    }
};