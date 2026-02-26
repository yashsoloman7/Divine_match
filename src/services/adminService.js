import { supabase } from '../config/supabase';

export const getAdmins = async () => {
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching admins:', error);
            return [];
        }

        return data;
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

        const { data, error } = await supabase
            .from('admins')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding admin:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error adding admin:', error);
        throw error;
    }
};

export const deleteAdmin = async (id) => {
    try {
        const { error } = await supabase
            .from('admins')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting admin with id ${id}:`, error);
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
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            return null; // Not found or error
        }

        return data;
    } catch (error) {
        return null;
    }
};
