const API_BASE_URL = "/api/activities"

export const fetchActivities = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch activities");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching activities:", error.message || error);
        throw error;
    }
};

export const fetchActivity = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch activity");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching activity:", error.message || error);
        throw error;
    }
};

export const createActivity = async (formData) => {

    let isValid = true;
    formData.forEach((value, key) => {
        if (key === 'image') {
            if (value == "null" || value.size == 0 || value == "" || value == "undefined") {
                console.log("this is image", key, value);
                isValid = false;
            }
            else if (value.size > 5 * 1024 * 1024) {
                isValid = false;
            }
        }
    });
    if (!isValid) {
        throw new Error('Upload valid image file..');
    } else {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to create activity");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating activity:", error.message || error);
        throw error;
    }
}
};

export const updateActivity = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update activity");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating activity:", error.message || error);
        throw error;
    }
};

export const deleteActivity = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete activity");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting activity:", error.message || error);
        throw error;
    }
};