const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        fullName: { type: String, required: true },
        age: { type: Number },
        dob: { type: Date },
        gender: { type: String },
        status: { type: String },
        phone: { type: String, required: true },
        email: { type: String },
        height: { type: String },
        bloodGroup: { type: String },
        complexion: { type: String },
        motherTongue: { type: String },
        nativePlace: { type: String },
        category: { type: String },
        fatherName: { type: String },
        motherName: { type: String },
        siblingsDetails: { type: String },
        presentAddress: { type: String },
        education: { type: String },
        workStatus: { type: String },
        companyName: { type: String },
        workplace: { type: String },
        annualSalary: { type: String },
        churchNameAddress: { type: String },
        pastorNameMobile: { type: String },
        partnerPreferences: { type: String },
        interests: { type: [String] },
        avatar: { type: String, default: 'https://xsgames.co/randomusers/avatar.php?g=pixel' },
        bio: { type: String }
    },
    {
        timestamps: true,
    }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
