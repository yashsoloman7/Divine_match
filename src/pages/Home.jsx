import React from 'react';
import { Link } from 'react-router-dom';
import { Users, HeartHandshake, Sparkles } from 'lucide-react';

const Home = () => {
    return (
        <div className="container">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '6rem 0', maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="heading-1 animate-fade-in" style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
                    Find Your Eternal Partner in Christ
                </h1>
                <p className="text-lead animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
                    Welcome to Divine Match. We are dedicated to uniting single, widowed, and divorced Christian men and women in holy matrimony.
                </p>
                <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
                    <Link to="/register" className="btn btn-primary">Register Free</Link>
                    <Link to="/events" className="btn btn-outline">View Upcoming Events</Link>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '4rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(155, 106, 56, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <HeartHandshake size={40} color="var(--primary)" />
                        </div>
                        <h3 className="heading-3">Trusted Profiles</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Detailed biodata cards help you understand candidates' values, faith, and life goals.</p>
                    </div>

                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(155, 106, 56, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <Users size={40} color="var(--primary)" />
                        </div>
                        <h3 className="heading-3">Yuvak Yuvti Sammelan</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Join our mega offline events to meet potential matches face-to-face in a spiritual environment.</p>
                    </div>

                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(155, 106, 56, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <Sparkles size={40} color="var(--primary)" />
                        </div>
                        <h3 className="heading-3">Smart Matchmaking</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Our secure system analyzes similarities to suggest the most compatible life partners.</p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;
