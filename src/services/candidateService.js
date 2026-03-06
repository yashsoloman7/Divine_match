const API_URL = 'http://localhost:5000/api/candidates';

export const getCandidates = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Unexpected error fetching candidates:', error);
        return [];
    }
};

export const addCandidate = async (candidate) => {
    try {
        // We now send the expected schema properties directly since the backend expects them
        const dbPayload = {
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            fullName: candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
            age: candidate.age ? parseInt(candidate.age, 10) : null,
            dob: candidate.dob || null,
            gender: candidate.gender || '',
            status: candidate.status || '',
            phone: candidate.phone || '',
            email: candidate.email || null,
            height: candidate.height || '',
            bloodGroup: candidate.bloodGroup || '',
            complexion: candidate.complexion || '',
            motherTongue: candidate.motherTongue || '',
            nativePlace: candidate.nativePlace || '',
            category: candidate.category || '',
            fatherName: candidate.fatherName || '',
            motherName: candidate.motherName || '',
            siblingsDetails: candidate.siblingsDetails || '',
            presentAddress: candidate.presentAddress || '',
            education: candidate.education || '',
            workStatus: candidate.workStatus || '',
            companyName: candidate.companyName || '',
            workplace: candidate.workplace || '',
            annualSalary: candidate.annualSalary || '',
            churchNameAddress: candidate.churchNameAddress || '',
            pastorNameMobile: candidate.pastorNameMobile || '',
            partnerPreferences: candidate.partnerPreferences || '',
            interests: candidate.interests || [],
            avatar: candidate.avatar || 'https://xsgames.co/randomusers/avatar.php?g=pixel',
            bio: candidate.bio || ''
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
        console.error('Unexpected error adding candidate:', error);
        throw error;
    }
};

export const getCandidateById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            console.error(`Error fetching candidate with id ${id}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Unexpected error fetching candidate ${id}:`, error);
        return null;
    }
};
