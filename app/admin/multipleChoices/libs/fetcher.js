const API_BASE_URL = "/api/multipleChoices"

export const fetchMultipleChoices = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch multipleChoices");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching multipleChoices:", error.message || error);
        throw error;
    }
};

export const fetchMultipleChoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch multipleChoice");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching multipleChoice:", error.message || error);
        throw error;
    }
};

export const createMultipleChoic = async (formData) => {

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
            throw new Error("Failed to create multipleChoice");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating multipleChoice:", error.message || error);
        throw error;
    }
}
};

export const updatedMultipleChoice = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update multipleChoice");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating multipleChoice:", error.message || error);
        throw error;
    }
};

export const deleteMultipleChoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete multipleChoice");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting multipleChoice:", error.message || error);
        throw error;
    }
};