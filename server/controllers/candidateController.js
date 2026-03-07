const Candidate = require('../models/Candidate');

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility
        const formattedCandidates = candidates.map(c => ({
            id: c._id,
            ...c._doc
        }));
        res.json(formattedCandidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (candidate) {
            res.json({ id: candidate._id, ...candidate._doc });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addCandidate = async (req, res) => {
    try {
        const candidateData = {
            ...req.body,
            fullName: req.body.fullName || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim(),
        };

        const candidate = new Candidate(candidateData);
        const createdCandidate = await candidate.save();
        res.status(201).json({ id: createdCandidate._id, ...createdCandidate._doc });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(400).json({ message: 'Invalid candidate data', error: error.message });
    }
};

const getCandidateByUserId = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.params.userId });
        if (candidate) {
            res.json({ id: candidate._id, ...candidate._doc });
        } else {
            res.status(404).json({ message: 'Candidate profile not found for this user' });
        }
    } catch (error) {
        console.error('Error fetching candidate by userId:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCandidate = async (req, res) => {
    try {
        const candidateData = {
            ...req.body,
            fullName: req.body.fullName || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim(),
        };

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            candidateData,
            { new: true, runValidators: true }
        );

        if (updatedCandidate) {
            res.json({ id: updatedCandidate._id, ...updatedCandidate._doc });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
};

module.exports = {
    getCandidates,
    getCandidateById,
    addCandidate,
    getCandidateByUserId,
    updateCandidate
};
