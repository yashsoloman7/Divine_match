const API_URL = 'http://localhost:5000/api/events';

export const getEvents = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Unexpected error fetching events:', error);
        return [];
    }
};

export const addEvent = async (event) => {
    try {
        const dbPayload = {
            title: event.title || '',
            description: event.description || '',
            dateStart: event.dateStart || new Date().toISOString().split('T')[0],
            dateEnd: event.dateEnd || null,
            location: event.location || '',
            priceCandidate: event.priceCandidate ? parseFloat(event.priceCandidate) : 0,
            priceFamily: event.priceFamily ? parseFloat(event.priceFamily) : 0
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
        console.error('Unexpected error adding event:', error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error(`Error deleting event with id ${id}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Unexpected error deleting event ${id}:`, error);
        return false;
    }
};
