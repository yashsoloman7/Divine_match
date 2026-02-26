import { supabase } from '../config/supabase';

export const getEvents = async () => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date_start', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }

        // Map snake_case to camelCase
        return data.map(dbRow => ({
            id: dbRow.id,
            title: dbRow.title,
            description: dbRow.description,
            dateStart: dbRow.date_start,
            dateEnd: dbRow.date_end,
            location: dbRow.location,
            priceCandidate: dbRow.price_candidate,
            priceFamily: dbRow.price_family,
            createdAt: dbRow.created_at
        }));
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
            date_start: event.dateStart || new Date().toISOString().split('T')[0],
            date_end: event.dateEnd || null,
            location: event.location || '',
            price_candidate: event.priceCandidate ? parseFloat(event.priceCandidate) : 0,
            price_family: event.priceFamily ? parseFloat(event.priceFamily) : 0
        };

        const { data, error } = await supabase
            .from('events')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding event:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error adding event:', error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting event with id ${id}:`, error);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Unexpected error deleting event ${id}:`, error);
        return false;
    }
};
