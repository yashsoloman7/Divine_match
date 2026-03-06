const API_URL = 'http://localhost:5000/api/admins';

export const getAdmins = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Unexpected error fetching admins:', error);
        return [];
    }
};

export const addAdmin = async (admin) => {
    try {
        const dbPayload = {
            name: admin.name || '',
            email: admin.email || '',
            role: admin.role || 'host'
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dbPayload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Unexpected error adding admin:', error);
        throw error;
    }
};

export const deleteAdmin = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error(`Error deleting admin with id ${id}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Unexpected error deleting admin ${id}:`, error);
        return false;
    }
};

// Function used during login to check if the user exists in the admin table
export const checkAdminByEmail = async (email) => {
    try {
        const response = await fetch(`${API_URL}/email/${encodeURIComponent(email)}`);
        if (!response.ok) {
            return null; // Not found or error
        }
        return await response.json();
    } catch (error) {
        return null;
    }
};
