import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { getAdmins, addAdmin, deleteAdmin } from '../services/adminService';

const AdminHosts = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'host'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        const data = await getAdmins();
        setAdmins(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await addAdmin(formData);
            setShowForm(false);
            setFormData({
                name: '',
                email: '',
                role: 'host'
            });
            fetchAdmins();
        } catch (error) {
            alert('Failed to add admin/host. Make sure the email is unique and Supabase is connected.');
        }
    };

    const handleDeleteAdmin = async (id, email) => {
        if (email === 'admin@divinematch.com') {
            alert("Cannot delete the Grand Admin account.");
            return;
        }

        if (window.confirm("Are you sure you want to remove this user's admin access?")) {
            try {
                await deleteAdmin(id);
                fetchAdmins();
            } catch (error) {
                alert('Failed to remove admin.');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading admins...</div>;

    const adminsList = admins.filter(a => a.role === 'admin');
    const hostsList = admins.filter(a => a.role === 'host');

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h2 className="heading-3" style={{ margin: 0, marginBottom: '0.5rem' }}>Co-Admins & Hosts</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, marginBottom: '1rem' }}>Manage team members who have access to this dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <UserPlus size={16} /> {showForm ? 'Cancel Creation' : 'Add Team Member'}
                    </button>
                </div>
            </div>

            {/* Creation Form */}
            {showForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
                    <h3 className="heading-3" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Invite Team Member</h3>
                    <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name*</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Smith" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address*</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role Definition*</label>
                            <select name="role" className="form-control" value={formData.role} onChange={handleInputChange}>
                                <option value="host">Host (Manage Events & Performers)</option>
                                <option value="admin">Full Admin (Manage Everything)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Grant Access</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admins List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(155, 106, 56, 0.05)', borderBottom: '1px solid #eee' }}>
                    <h3 className="heading-3" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={20} color="var(--primary)" /> Full Admins</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                        {adminsList.map((a) => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{a.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', width: '100px', textAlign: 'right' }}>
                                    {a.email !== 'admin@divinematch.com' && (
                                        <button onClick={() => handleDeleteAdmin(a.id, a.email)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', background: 'transparent' }} title="Revoke Access">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hosts List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(155, 106, 56, 0.05)', borderBottom: '1px solid #eee' }}>
                    <h3 className="heading-3" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={20} color="var(--primary)" /> Event Hosts</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                        {hostsList.map((h) => (
                            <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{h.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{h.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', width: '100px', textAlign: 'right' }}>
                                    <button onClick={() => handleDeleteAdmin(h.id, h.email)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '4px', border: '1px solid transparent', cursor: 'pointer', background: 'transparent' }} title="Revoke Access">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {hostsList.length === 0 && (
                            <tr>
                                <td colSpan="2" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    No hosts added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminHosts;
