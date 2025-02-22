const API_BASE_URL = "/api/audios"

export const fetchAudios = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch audios");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching audios:", error.message || error);
        throw error;
    }
};

export const fetchAudio = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`); 
        if (!response.ok) {
            throw new Error("Failed to fetch audio");
        }
        return await response.json();
    } catch (error) {
        console.log("Error fetching audio:", error.message || error);
        throw error;
    }
};

export const createAudio = async (formData) => {

    let isValid = true;
    formData.forEach((value, key) => {
        if (key === 'audio') {
            if (value == "null" || value.size == 0 || value == "" || value == "undefined") {
                console.log("this is audio", key, value);
                isValid = false;
            }
            // else if (value.size > 5 * 1024 * 1024) {
            //     isValid = false;
            // }
        }
    });
    if (!isValid) {
        throw new Error('Upload valid audio file..');
    } else {
    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to create audio");
        }
        return await response.json();
    } catch (error) {
        console.log("Error creating audio:", error.message || error);
        throw error;
    }
}
};

export const updateAudio = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to update audio");
        }
        return await response.json();
    } catch (error) {
        console.log("Error updating audio:", error.message || error);
        throw error;
    }
};

export const deleteAudio = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete audio");
        }
        return await response.json();
    } catch (error) {
        console.log("Error deleting audio:", error.message || error);
        throw error;
    }
};