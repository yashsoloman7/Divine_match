import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCandidateByUserId } from '../services/candidateService';
import { User as UserIcon, Settings, Heart, FileText, ChevronRight } from 'lucide-react';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.id) {
                try {
                    const profile = await getCandidateByUserId(user.id);
                    setCandidateProfile(profile);
                } catch (error) {
                    console.error("Failed to load candidate profile:", error);
                }
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [user]);

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ').filter(p => p.trim() !== '');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ color: 'var(--primary)' }}>Loading your profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 className="heading-2" style={{ color: 'var(--primary-dark)' }}>Not Authenticated</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please log in to view your profile.</p>
                <Link to="/login" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Log In</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '900px', padding: '3rem 1rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{
                    width: '100px', height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '2.5rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {getInitials(user.name)}
                </div>
                <div>
                    <h1 className="heading-2" style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-dark)' }}>{user.name}</h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserIcon size={16} /> {user.email} &bull; <span style={{ textTransform: 'capitalize' }}>{user.role} Account</span>
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Account Settings Card */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', borderBottom: '1px solid rgba(155,106,56,0.1)', paddingBottom: '1rem' }}>
                        <Settings size={22} />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Account Settings</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Full Name</span>
                            <span style={{ fontWeight: 500 }}>{user.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Email Address</span>
                            <span style={{ fontWeight: 500 }}>{user.email}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Account Type</span>
                            <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to log out?')) logout();
                        }}
                        className="btn-outline"
                        style={{ width: '100%', marginTop: '2rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                    >
                        Log Out Safely
                    </button>
                </div>

                {/* Candidate Matrimony Card */}
                <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,248,241,0.9))', border: '1px solid var(--primary-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', borderBottom: '1px solid rgba(155,106,56,0.2)', paddingBottom: '1rem' }}>
                        <Heart size={22} fill="var(--primary-light)" />
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Matrimony Profile</h3>
                    </div>

                    {candidateProfile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                                    Your matrimony biodata is active. You can review your public details or update your information for better matchmaking.
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                                    Profile is currently active
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button
                                    onClick={() => navigate(`/candidate/${candidateProfile.id}`)}
                                    className="btn-primary"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <FileText size={18} /> View My Biodata
                                </button>

                                <Link
                                    to="/register"
                                    className="btn-outline"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    Edit Information <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                                    It looks like you haven't set up your candidate matrimony profile yet. Create one to begin your journey towards a blessed union!
                                </p>
                            </div>
                            <Link to="/register" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                                Create Candidate Profile <ChevronRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
