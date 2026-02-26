import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Heart, User, Calendar, Phone, Mail, Award, MapPin, Download, Users, Briefcase, Church } from 'lucide-react';

const Biodata = () => {
    const location = useLocation();
    const profile = location.state?.profile;

    // Function to trigger print dialog
    const handlePrint = () => {
        window.print();
    };

    if (!profile) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 className="heading-2" style={{ color: 'var(--primary)' }}>No Profile Data Found</h2>
                <p className="text-lead">Please register to generate your beautiful biodata.</p>
                <Link to="/register" className="btn btn-primary">Go to Registration</Link>
            </div>
        );
    }

    const DetailItem = ({ label, value, icon: Icon }) => {
        if (!value) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {Icon && <Icon size={14} />} {label}
                </span>
                <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
            </div>
        );
    };

    const SectionTitle = ({ title, icon: Icon }) => (
        <h3 style={{
            borderBottom: '2px solid var(--primary-light)',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
            marginTop: '2rem',
            color: 'var(--primary-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            {Icon && <Icon size={20} />} {title}
        </h3>
    );

    return (
        <div className="container" style={{ maxWidth: '900px', padding: '2rem 1rem' }}>

            {/* Action Bar (Hidden on print) */}
            <div className="print-hide" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={20} /> Download / Print Biodata
                </button>
            </div>

            {/* Biodata Card - This area will be printed */}
            <div className="biodata-print-area" style={{
                background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)',
                border: '1px solid rgba(155, 106, 56, 0.2)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                position: 'relative'
            }}>

                {/* Decorative Header */}
                <div style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-80px', right: '-20px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

                    {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', objectFit: 'cover', position: 'relative', zIndex: 2 }} />
                    ) : (
                        <Heart size={50} fill="white" style={{ marginBottom: '0.5rem', opacity: 0.9, position: 'relative', zIndex: 2 }} />
                    )}

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {profile.fullName}
                        </h1>
                        <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
                            In search of a Christ-centered blessed union
                        </p>
                    </div>
                </div>

                <div style={{ padding: '0 3rem 3rem 3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>

                        {/* LEFT COLUMN */}
                        <div>
                            <SectionTitle title="Personal Details" icon={User} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <DetailItem label="Date of Birth" value={profile.dob} />
                                <DetailItem label="Age" value={`${profile.age} Years`} />
                                <DetailItem label="Gender" value={profile.gender} />
                                <DetailItem label="Height" value={profile.height} />
                                <DetailItem label="Blood Group" value={profile.bloodGroup} />
                                <DetailItem label="Complexion" value={profile.complexion} />
                                <DetailItem label="Mother Tongue" value={profile.motherTongue} />
                                <DetailItem label="Native Place" value={profile.nativePlace} />
                                <DetailItem label="Marital Status" value={profile.status} />
                                <DetailItem label="Category" value={profile.category} />
                            </div>

                            <SectionTitle title="Family Background" icon={Users} />
                            <DetailItem label="Father's Name" value={profile.fatherName} />
                            <DetailItem label="Mother's Name" value={profile.motherName} />
                            <DetailItem label="Siblings Details" value={profile.siblingsDetails} />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div>
                            <SectionTitle title="Education & Profession" icon={Briefcase} />
                            <DetailItem label="Educational Qualification" value={profile.education} />
                            <DetailItem label="Work Status" value={profile.workStatus} />
                            <DetailItem label="Company Name" value={profile.companyName} />
                            <DetailItem label="Workplace" value={profile.workplace} />
                            <DetailItem label="Annual Salary" value={profile.annualSalary} />

                            <SectionTitle title="Spiritual Background" icon={Church} />
                            <DetailItem label="Church Name & Address" value={profile.churchNameAddress} />
                            <DetailItem label="Pastor Name & Mobile" value={profile.pastorNameMobile} />

                            <SectionTitle title="Partner Preferences" icon={Heart} />
                            {profile.partnerPreferences ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', background: 'rgba(155,106,56,0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                                    "{profile.partnerPreferences}"
                                </p>
                            ) : (
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No specific preferences stated.</p>
                            )}

                            <SectionTitle title="Smart Match Interests" icon={Award} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {profile.interests && profile.interests.length > 0 ? (
                                    profile.interests.map((interest, idx) => (
                                        <span key={idx} style={{
                                            background: '#f9f6f0',
                                            border: '1px solid rgba(155, 106, 56, 0.2)',
                                            color: 'var(--primary-dark)',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            fontWeight: 500
                                        }}>
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No interests tags selected.</span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer of the card */}
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(155,106,56,0.05)', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid rgba(155,106,56,0.1)' }}>
                    Generated by Divine Match &bull; Christian Matrimony &bull; {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default Biodata;
