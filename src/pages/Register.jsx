import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTEREST_OPTIONS } from '../data/mockData';
import { addCandidate, getCandidateByUserId, updateCandidate } from '../services/candidateService';
import { useAuth } from '../context/AuthContext';
import { Check, UploadCloud } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [existingProfileId, setExistingProfileId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        siblingsDetails: '',
        phone: '',
        presentAddress: '',
        dob: '',
        age: '',
        motherTongue: '',
        height: '',
        heightFt: '',
        heightIn: '',
        heightCm: '',
        nativePlace: '',
        bloodGroup: '',
        complexion: '',
        category: '',
        status: 'Single',
        gender: 'Male', // Added this as it's standard needed for matchmaking algorithm
        education: '',
        workStatus: '',
        companyName: '',
        workplace: '',
        annualSalary: '',
        churchNameAddress: '',
        pastorNameMobile: '',
        partnerPreferences: '',
        interests: []
    });

    // Mock File State
    const [files, setFiles] = useState({
        passportPhoto: null,
        fullPhoto: null,
        baptismCert: null,
        marksheets: null,
        pastorLetter: null
    });

    useEffect(() => {
        const fetchExistingProfile = async () => {
            if (user && user.id) {
                try {
                    const profile = await getCandidateByUserId(user.id);
                    if (profile) {
                        setExistingProfileId(profile.id);

                        // Strip out MongoDB-specific fields we don't need in state
                        const { _id, id, __v, createdAt, updatedAt, ...profileData } = profile;

                        // Parse DOB for datetime-local or date input if needed
                        let formattedDob = '';
                        if (profileData.dob) {
                            formattedDob = new Date(profileData.dob).toISOString().split('T')[0];
                        }

                        setFormData({
                            ...formData,
                            ...profileData,
                            dob: formattedDob,
                            interests: profileData.interests || []
                        });

                        // Inform user
                        console.log("Existing profile found and loaded");
                    }
                } catch (error) {
                    console.error("Failed to fetch existing profile:", error);
                }
            }
            setIsLoading(false);
        };

        fetchExistingProfile();
    }, [user]);

    const handleInterestToggle = (interest) => {
        setFormData(prev => {
            const isSelected = prev.interests.includes(interest);
            if (isSelected) {
                return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...prev.interests, interest] };
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'dob') {
            const bd = new Date(value);
            const today = new Date();
            let calculatedAge = today.getFullYear() - bd.getFullYear();
            const m = today.getMonth() - bd.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
                calculatedAge--;
            }
            setFormData(prev => ({ ...prev, dob: value, age: calculatedAge >= 0 ? calculatedAge : '' }));
            return;
        }

        if (name === 'heightFt' || name === 'heightIn') {
            setFormData(prev => {
                const ft = name === 'heightFt' ? value : prev.heightFt;
                const inch = name === 'heightIn' ? value : prev.heightIn;

                const totalInches = (parseInt(ft || 0) * 12) + parseInt(inch || 0);
                const cm = totalInches > 0 ? Math.round(totalInches * 2.54) : '';

                const combined = ft && inch ? `${ft}'${inch}" / ${cm}cm` : '';
                return { ...prev, [name]: value, heightCm: cm, height: combined };
            });
            return;
        }

        if (name === 'heightCm') {
            setFormData(prev => {
                const cm = value;
                if (!cm || isNaN(cm)) {
                    return { ...prev, heightCm: value, heightFt: '', heightIn: '', height: '' };
                }
                const totalInches = Math.round(parseInt(cm) / 2.54);
                const ft = Math.floor(totalInches / 12);
                const inch = totalInches % 12;

                const combined = `${ft}'${inch}" / ${cm}cm`;
                return { ...prev, heightCm: value, heightFt: ft, heightIn: inch, height: combined };
            });
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0];
            setFiles(prev => ({ ...prev, [name]: file.name }));

            // Read passport photo for Biodata card avatar
            if (name === 'passportPhoto') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, avatarData: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use existing avatar if not updated, or generate dummy
        let avatarUrl = formData.avatarData;
        if (!avatarUrl && existingProfileId) {
            avatarUrl = formData.avatar;
        } else if (!avatarUrl) {
            avatarUrl = formData.gender === 'Male'
                ? `https://xsgames.co/randomusers/assets/avatars/male/${Math.floor(Math.random() * 50)}.jpg`
                : `https://xsgames.co/randomusers/assets/avatars/female/${Math.floor(Math.random() * 50)}.jpg`;
        }

        const submissionData = {
            ...formData,
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            avatar: avatarUrl,
            userId: user.id
        };

        try {
            let savedCandidate;
            if (existingProfileId) {
                savedCandidate = await updateCandidate(existingProfileId, submissionData);
            } else {
                savedCandidate = await addCandidate(submissionData);
            }
            navigate(`/candidate/${savedCandidate.id || savedCandidate._id}`);
        } catch (error) {
            console.error("Failed to register/update candidate:", error);
            alert("Error saving candidate! Ensure the backend connection is successful.");
        }
    };

    if (isLoading) {
        return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading profile data...</div>;
    }

    const SectionHeader = ({ title }) => (
        <h3 style={{
            gridColumn: '1 / -1',
            color: 'var(--primary-dark)',
            borderBottom: '2px solid rgba(155, 106, 56, 0.2)',
            paddingBottom: '0.5rem',
            marginTop: '2rem',
            marginBottom: '1rem'
        }}>
            {title}
        </h3>
    );

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: '2rem 1rem' }}>
            <div className="glass-card animate-fade-in" style={{ padding: '3rem' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>
                    {existingProfileId ? 'Update Your Profile' : 'Candidate Registration Form'}
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    {existingProfileId
                        ? 'Update your details below. Changes will be reflected in your Matrimony Biodata.'
                        : 'Please fill out all the details accurately to generate your Matrimony Biodata.'}
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                        <SectionHeader title="Basic Personal Details (व्यक्तिगत विवरण)" />

                        <div className="form-group">
                            <label className="form-label">Email Address (Email)*</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">First Name (पहला नाम)*</label>
                            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name (उपनाम)*</label>
                            <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Gender (लिंग)*</label>
                            <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date of birth (जन्मतिथि)*</label>
                            <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age (आयु)*</label>
                            <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required min="18" max="100" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Height* (Feet / Inches / cm)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input type="number" name="heightFt" className="form-control" value={formData.heightFt} onChange={handleChange} placeholder="Ft" min="2" max="8" required />
                                <span>'</span>
                                <input type="number" name="heightIn" className="form-control" value={formData.heightIn} onChange={handleChange} placeholder="In" min="0" max="11" required />
                                <span>"</span>
                                <span style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>=</span>
                                <input type="number" name="heightCm" className="form-control" value={formData.heightCm} onChange={handleChange} placeholder="cm" required />
                                <span>cm</span>
                            </div>
                            <input type="hidden" name="height" value={formData.height} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Blood Group</label>
                            <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Complexion (रंग)</label>
                            <select name="complexion" className="form-control" value={formData.complexion} onChange={handleChange}>
                                <option value="">Select Complexion...</option>
                                <option value="Fair">Fair</option>
                                <option value="Wheatish">Wheatish</option>
                                <option value="Dusky">Dusky</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mother tongue (मातृभाषा)</label>
                            <input type="text" name="motherTongue" className="form-control" value={formData.motherTongue} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Marital Status (वैवाहिक स्थिति)*</label>
                            <select name="status" className="form-control" value={formData.status} onChange={handleChange} required>
                                <option value="Single">Single</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Divorced">Divorced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category (वर्ग) {'{Your Denomination}'}*</label>
                            <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Denomination...</option>
                                <option value="Catholic">Catholic</option>
                                <option value="Protestant">Protestant</option>
                                <option value="Orthodox">Orthodox</option>
                                <option value="Pentecostal">Pentecostal</option>
                                <option value="Baptist">Baptist</option>
                                <option value="Methodist">Methodist</option>
                                <option value="Presbyterian">Presbyterian</option>
                                <option value="Assemblies of God">Assemblies of God</option>
                                <option value="Syrian Catholic">Syrian Catholic</option>
                                <option value="Syrian Jacobite">Syrian Jacobite</option>
                                <option value="Mar Thoma">Mar Thoma</option>
                                <option value="Independent/Non-Denominational">Independent/Non-Denominational</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <SectionHeader title="Family Details (पारिवारिक विवरण)" />

                        <div className="form-group">
                            <label className="form-label">Father's Name*</label>
                            <input type="text" name="fatherName" className="form-control" value={formData.fatherName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mother's Name*</label>
                            <input type="text" name="motherName" className="form-control" value={formData.motherName} onChange={handleChange} required />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Brother and Sister detail (if any in number) - भाई और बहन का विवरण (यदि कोई हो तो संख्या में )</label>
                            <input type="text" name="siblingsDetails" className="form-control" value={formData.siblingsDetails} onChange={handleChange} placeholder="e.g. 1 Brother, 2 Sisters" />
                        </div>

                        <SectionHeader title="Location & Contact Details (संपर्क विवरण)" />

                        <div className="form-group">
                            <label className="form-label">Mobile with WhatsApp Number*</label>
                            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Native place (मूलनिवासी)</label>
                            <input type="text" name="nativePlace" className="form-control" value={formData.nativePlace} onChange={handleChange} />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Present Address*</label>
                            <textarea name="presentAddress" className="form-control" value={formData.presentAddress} onChange={handleChange} rows="3" required></textarea>
                        </div>

                        <SectionHeader title="Education & Professional Background (शैक्षणिक और व्यावसायिक विवरण)" />

                        <div className="form-group">
                            <label className="form-label">Educational Qualification (शैक्षणिक योग्यता)*</label>
                            <input type="text" name="education" className="form-control" value={formData.education} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Work Status (कार्य व्यवसाय का विवरण)</label>
                            <input type="text" name="workStatus" className="form-control" value={formData.workStatus} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Companies Name (वर्तमान कार्यरत संस्था का नाम)</label>
                            <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Workplace (City and State)</label>
                            <input type="text" name="workplace" className="form-control" value={formData.workplace} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Annual Salary (वार्षिक आय)</label>
                            <input type="text" name="annualSalary" className="form-control" value={formData.annualSalary} onChange={handleChange} />
                        </div>

                        <SectionHeader title="Spiritual & Church Background (चर्च विवरण)" />

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Name Of Your Church and Its Address*</label>
                            <input type="text" name="churchNameAddress" className="form-control" value={formData.churchNameAddress} onChange={handleChange} required />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Your church pastor name and mobile number (Compulsory)*</label>
                            <input type="text" name="pastorNameMobile" className="form-control" value={formData.pastorNameMobile} onChange={handleChange} required />
                        </div>

                        <SectionHeader title="Partner Preferences & Interests (प्राथमिकता)" />

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Preference Of Bride/Groom {'{Additional Information}'} - विवाह हेतु वर/वधू की प्राथमिकता अन्य जानकारी</label>
                            <textarea name="partnerPreferences" className="form-control" value={formData.partnerPreferences} onChange={handleChange} rows="4" placeholder="Describe the qualities you are looking for in a partner..."></textarea>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Interests & Hobbies (Select all that apply for Smart Matchmaking)*</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {INTEREST_OPTIONS.map(interest => {
                                    const isSelected = formData.interests.includes(interest);
                                    return (
                                        <button
                                            type="button"
                                            key={interest}
                                            className={`tag ${isSelected ? 'active' : ''}`}
                                            onClick={() => handleInterestToggle(interest)}
                                            style={{ border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(155, 106, 56, 0.2)'}`, display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                                        >
                                            {isSelected && <Check size={14} />}
                                            {interest}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <SectionHeader title="Document Uploads (दस्तावेज़)" />

                        <div style={{ gridColumn: '1 / -1', background: '#fff8f1', padding: '1.5rem', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
                                <strong>Note:</strong> (स्वयं का पासपोर्ट साइज तथा एक फुल साइज अभी का फोटोग्राफ अवश्य ही संलग्न करें) Both photos should be the latest ones. Maximum file size: 5MB per document.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                                {/* File Upload 1 */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>1. ONE PASSPORT SIZE PHOTOGRAPH*</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <UploadCloud size={16} style={{ marginRight: '4px' }} /> Choose File
                                            <input type="file" name="passportPhoto" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {files.passportPhoto || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                                {/* File Upload 2 */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>2. ONE FULL-SIZE PHOTOGRAPH*</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <UploadCloud size={16} style={{ marginRight: '4px' }} /> Choose File
                                            <input type="file" name="fullPhoto" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {files.fullPhoto || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                                {/* File Upload 3 */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>3. BAPTISM CERTIFICATE*</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <UploadCloud size={16} style={{ marginRight: '4px' }} /> Choose File
                                            <input type="file" name="baptismCert" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,image/*" />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {files.baptismCert || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                                {/* File Upload 4 */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>4. CLASS 10th/12th MARKSHEET*</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <UploadCloud size={16} style={{ marginRight: '4px' }} /> Choose File
                                            <input type="file" name="marksheets" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,image/*" />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {files.marksheets || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                                {/* File Upload 5 */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>5. PASTOR'S RECOMMENDATION LETTER*</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <label className="btn-outline" style={{ display: 'inline-flex', padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <UploadCloud size={16} style={{ marginRight: '4px' }} /> Choose File
                                            <input type="file" name="pastorLetter" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,image/*" />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {files.pastorLetter || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <button type="submit" className="btn btn-primary" style={{ minWidth: '300px', fontSize: '1.2rem', padding: '1rem 2rem' }}>
                            {existingProfileId ? 'Update Registration & Biodata' : 'Submit Registration & Generate Biodata'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
