const API_BASE_URL = "/api/pronounciations"

export const fetchAllTexts = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch texts");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching texts:", error.message || error);
        throw error;
    }
};

export const fetchText = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch Text");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching text:", error.message || error);
        throw error;
    }
};

export const createText = async (formData) => {

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
            throw new Error("Failed to create text");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating text:", error.message || error);
        throw error;
    }
}
};

export const updateText = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update text");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating text:", error.message || error);
        throw error;
    }
};

export const deleteText = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete text");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting text:", error.message || error);
        throw error;
    }
};