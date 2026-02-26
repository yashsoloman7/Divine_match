import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCandidates } from '../services/candidateService';
import { Trash2, Search, UserCheck, Download, UploadCloud, Eye } from 'lucide-react';
import Papa from 'papaparse';

const AdminUsers = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const data = await getCandidates();
            setCandidates(data);
        };
        loadData();
    }, []);

    const handleDelete = (id) => {
        // In a real app, delete from DB. Here we mock it by updating state.
        setCandidates(prev => prev.filter(c => c.id !== id));
    };

    const handleView = (candidate) => {
        navigate('/biodata', { state: { profile: candidate } });
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const newCandidates = results.data.map((row, index) => ({
                    id: 'imported-' + Date.now() + '-' + index,
                    fullName: row['Full Name'] || row['Name'] || 'Unknown User',
                    age: parseInt(row['Age']) || 25,
                    gender: row['Gender'] || 'Unspecified',
                    status: row['Status'] || 'Single',
                    phone: row['Phone'] || '000-000-0000',
                    email: row['Email'] || '',
                    presentAddress: row['Location'] || row['Address'] || '',
                    interests: row['Interests'] ? row['Interests'].split(',').map(i => i.trim()) : []
                }));
                // Prepend the new candidates to the table
                setCandidates(prev => [...newCandidates, ...prev]);
                // Reset file input
                e.target.value = null;
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
                alert("Failed to parse CSV file. Please ensure it is correctly formatted.");
            }
        });
    };

    const handleExport = () => {
        // Format data for export
        const exportData = candidates.map(c => ({
            "Full Name": c.fullName,
            "Age": c.age,
            "Gender": c.gender,
            "Status": c.status,
            "Phone": c.phone,
            "Email": c.email || 'N/A',
            "Location": c.presentAddress || 'N/A',
            "Interests": c.interests ? c.interests.join(', ') : ''
        }));

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filtered = candidates.filter(c =>
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="animate-fade-in">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="heading-3" style={{ margin: 0 }}>Registered Candidates</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv"
                        style={{ display: 'none' }}
                    />
                    <button onClick={handleImportClick} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e3f2fd', color: '#1565c0', borderColor: '#bbdefb' }}>
                        <UploadCloud size={18} /> Import CSV
                    </button>

                    <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(155, 106, 56, 0.05)', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Interests</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.fullName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{c.age} yrs &bull; {c.gender}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', backgroundColor: c.status === 'Single' ? '#e8f5e9' : '#fff3e0', color: c.status === 'Single' ? '#2e7d32' : '#e65100' }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {c.phone}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {c.interests.slice(0, 2).map((i, idx) => (
                                            <span key={idx} style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{i}</span>
                                        ))}
                                        {c.interests.length > 2 && <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>+{c.interests.length - 2}</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button onClick={() => handleView(c)} style={{ color: 'var(--primary)', padding: '0.5rem', borderRadius: '4px', border: '1px solid transparent' }} title="View Biodata" onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(155,106,56,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(c.id)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '4px', border: '1px solid transparent' }} title="Delete User" onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(211,47,47,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    <UserCheck size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    No candidates found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
