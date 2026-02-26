import { supabase } from '../config/supabase';

export const getCandidates = async () => {
    try {
        const { data, error } = await supabase
            .from('candidates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching candidates:', error);
            return [];
        }

        // Map snake_case database columns back to camelCase frontend properties
        return data.map(dbRow => ({
            id: dbRow.id,
            firstName: dbRow.first_name,
            lastName: dbRow.last_name,
            fullName: dbRow.full_name,
            age: dbRow.age,
            dob: dbRow.dob,
            gender: dbRow.gender,
            status: dbRow.status,
            phone: dbRow.phone,
            email: dbRow.email,
            height: dbRow.height,
            bloodGroup: dbRow.blood_group,
            complexion: dbRow.complexion,
            motherTongue: dbRow.mother_tongue,
            nativePlace: dbRow.native_place,
            category: dbRow.category,
            fatherName: dbRow.father_name,
            motherName: dbRow.mother_name,
            siblingsDetails: dbRow.siblings_details,
            presentAddress: dbRow.present_address,
            education: dbRow.education,
            workStatus: dbRow.work_status,
            companyName: dbRow.company_name,
            workplace: dbRow.workplace,
            annualSalary: dbRow.annual_salary,
            churchNameAddress: dbRow.church_name_address,
            pastorNameMobile: dbRow.pastor_name_mobile,
            partnerPreferences: dbRow.partner_preferences,
            interests: dbRow.interests,
            avatar: dbRow.avatar,
            bio: dbRow.bio,
            createdAt: dbRow.created_at
        }));
    } catch (error) {
        console.error('Unexpected error fetching candidates:', error);
        return [];
    }
};

export const addCandidate = async (candidate) => {
    try {
        // Map camelCase frontend properties to snake_case database columns
        const dbPayload = {
            first_name: candidate.firstName || '',
            last_name: candidate.lastName || '',
            full_name: candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
            age: candidate.age ? parseInt(candidate.age, 10) : null,
            dob: candidate.dob || null,
            gender: candidate.gender || '',
            status: candidate.status || '',
            phone: candidate.phone || '',
            email: candidate.email || null,
            height: candidate.height || '',
            blood_group: candidate.bloodGroup || '',
            complexion: candidate.complexion || '',
            mother_tongue: candidate.motherTongue || '',
            native_place: candidate.nativePlace || '',
            category: candidate.category || '',
            father_name: candidate.fatherName || '',
            mother_name: candidate.motherName || '',
            siblings_details: candidate.siblingsDetails || '',
            present_address: candidate.presentAddress || '',
            education: candidate.education || '',
            work_status: candidate.workStatus || '',
            company_name: candidate.companyName || '',
            workplace: candidate.workplace || '',
            annual_salary: candidate.annualSalary || '',
            church_name_address: candidate.churchNameAddress || '',
            pastor_name_mobile: candidate.pastorNameMobile || '',
            partner_preferences: candidate.partnerPreferences || '',
            interests: candidate.interests || [],
            avatar: candidate.avatar || 'https://xsgames.co/randomusers/avatar.php?g=pixel',
            bio: candidate.bio || ''
        };

        const { data, error } = await supabase
            .from('candidates')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error adding candidate:', error);
            throw error;
        }

        return data; // returns the created db row
    } catch (error) {
        console.error('Unexpected error adding candidate:', error);
        throw error;
    }
};

export const getCandidateById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('candidates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching candidate with id ${id}:`, error);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Unexpected error fetching candidate ${id}:`, error);
        return null;
    }
};
