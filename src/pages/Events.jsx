import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, CheckCircle, Sparkles } from 'lucide-react';
import { getEvents } from '../services/eventService';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registeredEventId, setRegisteredEventId] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const handleRegister = (e, eventId) => {
        e.preventDefault();
        setRegisteredEventId(eventId);
    };

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading events...</div>;
    }

    if (events.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <CalendarIcon size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5, color: 'var(--primary)' }} />
                <h2 className="heading-2">No Upcoming Events</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    There are no matrimonial events scheduled at the moment. Please check back later or ensure you are registered as a candidate to receive email notifications.
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {events.map((evt, index) => (
                <div key={evt.id} style={{ marginBottom: '6rem' }}>
                    {/* Event Hero */}
                    <div className="glass-card animate-fade-in" style={{
                        position: 'relative', overflow: 'hidden', padding: 0, marginBottom: '3rem',
                        border: 'none', boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{
                            background: `linear-gradient(rgba(110, 72, 34, 0.8), rgba(96, 58, 64, 0.9))`,
                            color: 'white',
                            padding: '4rem 2rem',
                            textAlign: 'center'
                        }}>
                            <h2 className="heading-1" style={{ color: 'white' }}>{evt.title}</h2>
                            <p className="text-lead" style={{ color: 'var(--surface-alt)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                {evt.description || 'A blessed gathering of Christian singles designed to foster meaningful, Christ-centered relationships.'}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', opacity: 0.9 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CalendarIcon size={20} /> {evt.dateStart} {evt.dateEnd ? `to ${evt.dateEnd}` : ''}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={20} /> {evt.location}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>

                        {/* Event Details */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                            <h3 className="heading-2" style={{ color: 'var(--primary-dark)' }}>Event Highlights</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                Join hundreds of devoted individuals seeking their eternal partner.
                                The Sammelan offers a safe, spiritual environment with structured matching sessions,
                                counseling by elders, worship nights, and guided introductions.
                            </p>

                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-primary)' }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <Users size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <strong>Guided Meet & Greets</strong>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Structured ice-breakers grouped by age and interests.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <Clock size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <strong>Spiritual Workshops</strong>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sessions on building a Christ-centered marriage.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <Sparkles size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <strong>Family Consultations</strong>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Elders and pastors present to guide families.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Event Registration Form */}
                        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
                            <h3 className="heading-3" style={{ textAlign: 'center', marginBottom: '2rem' }}>Pass Registration</h3>

                            {registeredEventId === evt.id ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--success)' }}>
                                    <CheckCircle size={60} style={{ margin: '0 auto 1rem' }} />
                                    <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Registration Confirmed!</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>We look forward to seeing you. An email with your digital pass has been requested.</p>
                                </div>
                            ) : (
                                <form onSubmit={(e) => handleRegister(e, evt.id)}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" placeholder="Enter name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" placeholder="For event ticket" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pass Type</label>
                                        <select className="form-control" required>
                                            <option value="candidate">Candidate Only (₹{evt.priceCandidate || 0})</option>
                                            <option value="family">Candidate + Family (₹{evt.priceFamily || 0})</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                        Confirm Registration
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default Events;
