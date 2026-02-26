import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, Download, CheckCircle } from 'lucide-react';
import { getEvents, addEvent, deleteEvent } from '../services/eventService';
import Papa from 'papaparse';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateStart: '',
        dateEnd: '',
        location: '',
        priceCandidate: 0,
        priceFamily: 0
    });

    // We're keeping mock registrations since there's no registration table requested yet,
    // just focusing on admin managing the actual Events table.
    const [registrations] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', passType: 'Candidate Only (₹50)', date: '2026-10-15' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', passType: 'Candidate + Family (₹100)', date: '2026-10-16' },
        { id: 3, name: 'Michael Johnson', email: 'mike@example.com', passType: 'Candidate Only (₹50)', date: '2026-10-18' },
    ]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await addEvent(formData);
            setShowEventForm(false);
            setFormData({
                title: '',
                description: '',
                dateStart: '',
                dateEnd: '',
                location: '',
                priceCandidate: 0,
                priceFamily: 0
            });
            fetchEvents();
        } catch (error) {
            alert('Failed to create event. Is Supabase connected?');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            try {
                await deleteEvent(id);
                fetchEvents();
            } catch (error) {
                alert('Failed to delete event.');
            }
        }
    };

    const handleExportRegistrations = () => {
        const exportData = registrations.map(r => ({
            "Attendee Name": r.name,
            "Email": r.email,
            "Pass Type": r.passType,
            "Registration Date": r.date,
            "Status": "Confirmed"
        }));

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `event_registrations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading events...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h2 className="heading-3" style={{ margin: 0, marginBottom: '0.5rem' }}>Event Management</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, marginBottom: '1rem' }}>Manage all active events and view sample registrations</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowEventForm(!showEventForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <Plus size={16} /> {showEventForm ? 'Cancel Creation' : 'Create New Event'}
                    </button>
                </div>
            </div>

            {/* Event Creation Form */}
            {showEventForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
                    <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Create New Event</h3>
                    <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Event Title*</label>
                            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location*</label>
                            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleInputChange} required placeholder="e.g. St. Paul's Retreat Center" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date*</label>
                            <input type="date" name="dateStart" className="form-control" value={formData.dateStart} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date (Optional)</label>
                            <input type="date" name="dateEnd" className="form-control" value={formData.dateEnd} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Candidate Pass Price (₹)</label>
                            <input type="number" name="priceCandidate" className="form-control" value={formData.priceCandidate} onChange={handleInputChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Family Pass Price (₹)</label>
                            <input type="number" name="priceFamily" className="form-control" value={formData.priceFamily} onChange={handleInputChange} min="0" />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Description / Highlights</label>
                            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Describe the event highlights..."></textarea>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Event</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Active Events List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '3rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(155, 106, 56, 0.05)', borderBottom: '1px solid #eee' }}>
                    <h3 className="heading-3" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Active Events</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Event</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((evt) => (
                            <tr key={evt.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{evt.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {evt.description}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {evt.dateStart} {evt.dateEnd ? `to ${evt.dateEnd}` : ''}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{evt.location}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button onClick={() => handleDeleteEvent(evt.id)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', background: 'transparent' }} title="Delete Event">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    No events created yet. Create one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sample Registrations Below */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="heading-3" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Sample Registrations List</h3>
                <button onClick={handleExportRegistrations} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Download size={16} /> Export to Sheets (CSV)
                </button>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(155, 106, 56, 0.05)', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Attendee Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pass Type</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Registration Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.email}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                                        {r.passType}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.date}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.85rem' }}>
                                        <CheckCircle size={14} /> Confirmed
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEvents;
