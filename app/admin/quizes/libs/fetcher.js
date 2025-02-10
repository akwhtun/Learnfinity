const API_BASE_URL = "/api/quizes"

export const fetchQuizes = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch quizes");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching quizes:", error.message || error);
        throw error;
    }
};

export const fetchQuiz = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch quiz");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching quiz:", error.message || error);
        throw error;
    }
};

export const createQuiz = async (formData) => {

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
            throw new Error("Failed to create quiz");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating quiz:", error.message || error);
        throw error;
    }
}
};

export const updatedQuiz = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update quiz");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating quiz:", error.message || error);
        throw error;
    }
};

export const deleteQuiz = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete quiz");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting quiz:", error.message || error);
        throw error;
    }
};