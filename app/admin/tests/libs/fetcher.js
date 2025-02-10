const API_BASE_URL = "/api/tests"

export const fetchTests = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch test");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching test:", error.message || error);
        throw error;
    }
};

export const fetchTest = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch test");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching test:", error.message || error);
        throw error;
    }
};

export const createTest = async (formData) => {

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
            throw new Error("Failed to create test");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating test:", error.message || error);
        throw error;
    }
}
};

export const updateTest = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update test");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating test:", error.message || error);
        throw error;
    }
};

export const deleteTest = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete test");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting test:", error.message || error);
        throw error;
    }
};